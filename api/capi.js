const crypto = require('crypto');

module.exports = async (req, res) => {
    // 0. Health Check for debugging
    if (req.method === 'GET') {
        return res.status(200).json({ 
            status: 'online', 
            time: new Date().toISOString(),
            config: {
                has_meta_token: !!process.env.META_ACCESS_TOKEN,
                has_tiktok_token: !!process.env.TIKTOK_ACCESS_TOKEN,
                has_webhook: !!process.env.LEADS_SHEET_WEBHOOK
            }
        });
    }

    // 1. Method Check
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { event_name, event_id, event_source_url, user_data = {}, custom_data = {}, test_event_code } = req.body;
    
    // Config
    const META_PIXEL_ID = '993205486461512';
    const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const TIKTOK_PIXEL_ID = process.env.TIKTOK_PIXEL_ID;
    const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;
    const SHEETS_WEBHOOK = process.env.LEADS_SHEET_WEBHOOK || 'https://script.google.com/macros/s/AKfycbz1B0g5CpAJEFFqOVG6rBFtrkg2NoLkf0TyUASCYhxOygPsfahTBrKZ_58CHEI7uO3s/exec';
    
    const FINAL_TEST_CODE = test_event_code || 'TEST72689';

    console.log(`[CAPI] Incoming Event: ${event_name}`, { 
        event_id, 
        has_meta: !!META_ACCESS_TOKEN, 
        has_tiktok: !!TIKTOK_ACCESS_TOKEN 
    });

    // Helper: SHA256 hashing
    const hash = (val) => {
        if (!val) return undefined;
        const clean = val.toString().toLowerCase().trim();
        return crypto.createHash('sha256').update(clean).digest('hex');
    };

    const client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const user_agent = req.headers['user-agent'];
    const city = custom_data.city || user_data.ct || user_data.city;

    // ─── META CAPI PREP ──────────────────────────────────────────────────────
    const metaHashedUserData = {
        client_ip_address: client_ip,
        client_user_agent: user_agent,
        ph: hash(user_data.ph),
        em: hash(user_data.em),
        fn: hash(user_data.fn),
        ct: hash(city),
        external_id: user_data.external_id,
        fbc: user_data.fbc || null,
        fbp: user_data.fbp || null
    };
    if (!metaHashedUserData.fbc) delete metaHashedUserData.fbc;
    if (!metaHashedUserData.fbp) delete metaHashedUserData.fbp;

    const metaPayload = {
        data: [{
            event_name: event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_id: event_id,
            event_source_url: event_source_url,
            action_source: 'website',
            user_data: metaHashedUserData,
            custom_data: custom_data
        }],
        test_event_code: FINAL_TEST_CODE
    };

    // ─── TIKTOK CAPI PREP ────────────────────────────────────────────────────
    // TikTok Event Mapping: Purchase -> CompletePayment, Lead -> SubmitForm
    const ttEventMap = {
        'Purchase': 'CompletePayment',
        'Lead': 'SubmitForm',
        'InitiateCheckout': 'InitiateCheckout',
        'PageView': 'PageView'
    };
    const ttEventName = ttEventMap[event_name] || event_name;

    const ttPayload = {
        event: ttEventName,
        event_id: event_id,
        timestamp: new Date().toISOString(),
        context: {
            ad: { callback: user_data.ttclid || null },
            page: { url: event_source_url },
            user: {
                phone_number: hash(user_data.ph),
                email: hash(user_data.em),
                ip: client_ip,
                user_agent: user_agent
            }
        },
        properties: {
            content_type: 'product',
            currency: 'PKR',
            value: custom_data.value || 1499
        }
    };

    const tasks = [];

    // Task 1: Meta CAPI
    if (META_ACCESS_TOKEN) {
        tasks.push(
            fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metaPayload)
            }).then(r => r.json()).catch(e => ({ error: 'Meta Failed', msg: e.message }))
        );
    }

    // Task 2: TikTok CAPI
    if (TIKTOK_ACCESS_TOKEN && TIKTOK_PIXEL_ID) {
        tasks.push(
            fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Token': TIKTOK_ACCESS_TOKEN
                },
                body: JSON.stringify({
                    event_source: 'web',
                    event_source_id: TIKTOK_PIXEL_ID,
                    data: [ttPayload]
                })
            }).then(r => r.json()).catch(e => ({ error: 'TikTok Failed', msg: e.message }))
        );
    }

    // Task 3: Google Sheets (Leads only)
    if (event_name === 'Lead' && SHEETS_WEBHOOK) {
        const params = new URLSearchParams();
        const timestamp = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
        const dataToSubmit = {
            "Timestamp": timestamp,
            "Name": user_data.fn || user_data.name || 'N/A',
            "Phone": user_data.ph || user_data.phone || 'N/A',
            "City": city || 'N/A',
            "URL": event_source_url,
            "Traffic Type": custom_data.traffic_type || 'organic',
            "fbc": user_data.fbc || '',
            "gclid": req.body.gclid || custom_data.gclid || '',
            "ttclid": user_data.ttclid || ''
        };
        Object.entries(dataToSubmit).forEach(([k, v]) => params.append(k, v));
        tasks.push(
            fetch(SHEETS_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit)
            }).then(r => r.text()).catch(e => ({ error: 'Sheets Failed', msg: e.message }))
        );
    }

    try {
        const results = await Promise.all(tasks);
        return res.status(200).json({ 
            success: true, 
            event: event_name, 
            results: results 
        });
    } catch (error) {
        return res.status(500).json({ error: 'Processing Failed', details: error.message });
    }
};
