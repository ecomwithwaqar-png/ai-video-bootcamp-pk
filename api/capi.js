const crypto = require('crypto');

module.exports = async (req, res) => {
    // 0. Health Check for debugging
    if (req.method === 'GET') {
        return res.status(200).json({ 
            status: 'online', 
            time: new Date().toISOString(),
            config: {
                has_meta_token: !!process.env.META_ACCESS_TOKEN,
                has_webhook: !!process.env.LEADS_SHEET_WEBHOOK
            }
        });
    }

    // 1. Method Check
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { event_name, event_id, event_source_url, user_data = {}, custom_data = {}, test_event_code } = req.body;
    const PIXEL_ID = '993205486461512';
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    // FORCED FIX: Ignoring environment variable to bypass old Vercel settings
    const SHEETS_WEBHOOK = 'https://script.google.com/macros/s/AKfycbz50jY_uuDyAhBxEZFsYZ-RWoBOupBs_b4-Ekf3gkFZisQ1TBmTIhaxQVhBMe_Y5qYF/exec';
    
    // Use request test code if provided, otherwise fallback to default
    const FINAL_TEST_CODE = test_event_code || 'TEST72689';

    console.log(`[CAPI] Incoming Event: ${event_name}`, { event_id, has_token: !!ACCESS_TOKEN, has_webhook: !!SHEETS_WEBHOOK });

    if (!ACCESS_TOKEN) {
        console.error('[CAPI] ERROR: META_ACCESS_TOKEN is missing from environment variables');
        return res.status(500).json({ error: 'Server configuration error: Meta Access Token missing' });
    }

    // Helper: Meta requires SHA256 hashing for PII data
    const hash = (val) => {
        if (!val) return undefined;
        const clean = val.toString().toLowerCase().trim();
        return crypto.createHash('sha256').update(clean).digest('hex');
    };

    // Prepare User Data (Hashed for Meta)
    const city = custom_data.city || user_data.ct || user_data.city;
    
    const hashedUserData = {
        client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        client_user_agent: req.headers['user-agent'],
        ph: hash(user_data.ph),
        em: hash(user_data.em),
        fn: hash(user_data.fn),
        ct: hash(city),
        external_id: user_data.external_id 
    };

    // 2. Meta CAPI Payload
    const payload = {
        data: [{
            event_name: event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_id: event_id,
            event_source_url: event_source_url,
            action_source: 'website',
            user_data: hashedUserData,
            custom_data: custom_data
        }],
        test_event_code: FINAL_TEST_CODE
    };

    const tasks = [];

    // Task 1: Meta CAPI
    tasks.push(
        fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(async r => {
            const result = await r.json();
            console.log(`[CAPI] Meta Response for ${event_name}:`, result);
            return result;
        })
        .catch(err => {
            console.error(`[CAPI] Meta Fetch Error:`, err);
            return { error: 'Meta Fetch Failed', details: err.message };
        })
    );

    // Task 2: Google Sheets (Only for Lead events)
    let sheetsStatus = 'not_triggered';
    if (event_name === 'Lead') {
        if (SHEETS_WEBHOOK) {
            sheetsStatus = 'pending';
            
            // Multi-format Master Fix for Google Sheets
            const params = new URLSearchParams();
            const timestamp = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
            const name = user_data.fn || user_data.name || user_data.external_id || 'N/A';
            const phone = user_data.ph || user_data.phone || 'N/A';
            const cityForSheets = city || 'N/A';
            const url = event_source_url;
            const traffic = custom_data.traffic_type || 'organic';

            // Add both casing styles to be 100% safe
            const dataToSubmit = {
                "Timestamp": timestamp, "timestamp": timestamp,
                "Name": name, "name": name,
                "Event ID": event_id, "event_id": event_id,
                "Phone": phone, "phone": phone,
                "City": cityForSheets, "city": cityForSheets,
                "URL": url, "url": url,
                "Traffic Type": traffic, "traffic": traffic
            };

            Object.entries(dataToSubmit).forEach(([key, val]) => params.append(key, val));

            const finalWebhookUrl = SHEETS_WEBHOOK.includes('?') 
                ? `${SHEETS_WEBHOOK}&${params.toString()}` 
                : `${SHEETS_WEBHOOK}?${params.toString()}`;

            tasks.push(
                fetch(finalWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString()
                })
                .then(async r => {
                    const text = await r.text();
                    console.log(`[CAPI] Sheets Status: ${r.status}, Response: ${text.substring(0, 50)}`);
                    sheetsStatus = 'success';
                    return { success: r.ok, status: r.status, response: text };
                })
                .catch(err => {
                    console.error('[CAPI] Sheets Webhook Error:', err);
                    sheetsStatus = 'error';
                    return { error: 'Sheets Webhook Failed', details: err.message };
                })
            );
        } else {
            sheetsStatus = 'missing_webhook_url';
            console.warn('[CAPI] WARNING: Lead event received but LEADS_SHEET_WEBHOOK is not set');
        }
    }

    try {
        const results = await Promise.all(tasks);
        const metaResult = results[0];
        const sheetsResult = event_name === 'Lead' ? results[1] : null;

        return res.status(200).json({ 
            success: true, 
            event: event_name,
            meta: metaResult,
            sheets: sheetsResult || { status: sheetsStatus },
            debug: {
                has_webhook: !!SHEETS_WEBHOOK,
                event_id: event_id
            }
        });
    } catch (error) {
        console.error('[CAPI] Fatal Processing Error:', error);
        return res.status(500).json({ error: 'Failed to process event', details: error.message });
    }
};
