const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { event_name, event_id, event_source_url, user_data, custom_data } = req.body;
    const PIXEL_ID = '993205486461512';
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

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
        }]
    };

    try {
        const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return res.status(200).json(result);
    } catch (error) {
        console.error('CAPI Error:', error);
        return res.status(500).json({ error: 'Failed to send event to Meta' });
    }
};
