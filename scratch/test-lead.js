const eventId = 'test_lead_' + Date.now();

const payload = {
    event_name: 'Lead',
    event_id: eventId,
    event_source_url: 'https://aivideobootcamp.online/checkout',
    user_data: {
        fn: 'Test Waqar Upsell',
        ph: '03123456789',
        fbc: 'fb.1.123456789.123456789',
        fbp: 'fb.1.987654321.987654321'
    },
    custom_data: {
        value: 2498,
        city: 'Rawalpindi',
        traffic_type: 'paid'
    }
};

console.log('🚀 Sending mock Lead event with Upsell (value = 2498) to live server...');

fetch('https://aivideobootcamp.online/api/capi', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
})
.then(async r => {
    const data = await r.json();
    console.log('HTTP Status:', r.status);
    console.log('Response:', JSON.stringify(data, null, 2));
})
.catch(err => {
    console.error('❌ Error sending request:', err);
});
