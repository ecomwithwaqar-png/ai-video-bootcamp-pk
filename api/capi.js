
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const PIXEL_ID = '993205486461512';
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || 'EAARXc2Dz9wIBRfORCrH81NpT7aA8svz4dZC6jhT1G5UQZAEEOK6Tdku4FX8mkKhMq5d5H5FST0zSZAe3x0VKKwfb5K5vrLOUcqlwzAXFp56MI6smySSHtkCmFNd8xDibkJvARD6gw0gSIZAXbcr2P3mi2fNZAnUbAxIokFKOCZBiBmsZBBNfCZAgZANLuud3lrwZDZD';
    
    const { event_name, event_id, user_data, custom_data, event_source_url } = req.body;

    const payload = {
        data: [{
            event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_id,
            action_source: 'website',
            event_source_url,
            user_data: {
                client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                client_user_agent: req.headers['user-agent'],
                ...user_data
            },
            custom_data
        }]
    };

    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
