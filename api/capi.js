module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { event_name, event_id, event_source_url, user_data, custom_data } = req.body;
    const PIXEL_ID = '993205486461512';
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const SHEETS_WEBHOOK = process.env.LEADS_SHEET_WEBHOOK;
    const TEST_EVENT_CODE = 'TEST72689'; // Added from user screenshot

    if (!ACCESS_TOKEN) {
        console.error('META_ACCESS_TOKEN is missing');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Prepare Meta CAPI payload
    const payload = {
        data: [{
            event_name: event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_id: event_id,
            event_source_url: event_source_url,
            action_source: 'website',
            user_data: {
                client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                client_user_agent: req.headers['user-agent'],
                ...user_data
            },
            custom_data: custom_data
        }],
        test_event_code: TEST_EVENT_CODE
    };

    // Parallel execution: Meta CAPI and Google Sheets (if Lead)
    const tasks = [];

    // 1. Meta CAPI Task
    tasks.push(
        fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(r => r.json())
    );

    // 2. Google Sheets Task (Only for Lead events)
    if (event_name === 'Lead' && SHEETS_WEBHOOK) {
        const sheetData = {
            timestamp: new Date().toISOString(),
            event_id: event_id,
            name: user_data.external_id || 'N/A', // We can improve how we pass name/phone
            phone: user_data.phone || 'N/A',
            city: custom_data.city || 'N/A',
            url: event_source_url,
            traffic: custom_data.traffic_type || 'organic'
        };

        tasks.push(
            fetch(SHEETS_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sheetData)
            }).catch(err => console.error('Sheets Error:', err))
        );
    }

    try {
        const [capiResult] = await Promise.all(tasks);
        return res.status(200).json({ 
            success: true, 
            meta: capiResult,
            sheets: event_name === 'Lead' ? (SHEETS_WEBHOOK ? 'sent' : 'no_webhook') : 'skipped'
        });
    } catch (error) {
        console.error('Processing Error:', error);
        return res.status(500).json({ error: 'Failed to process event' });
    }
};
