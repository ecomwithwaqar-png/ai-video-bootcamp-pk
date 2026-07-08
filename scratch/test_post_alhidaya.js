const url = 'https://alhidaya-zeta.vercel.app/api/capi';

const payload = {
  event_name: 'Lead',
  event_id: 'test_alhidaya_post_' + Math.floor(Math.random() * 1000000),
  event_source_url: 'https://alhidaya-zeta.vercel.app/checkout',
  user_data: {
    fn: 'Al Hidaya Live Test',
    ph: '03001234567',
    fbc: 'fb.1.123456.789012',
    fbp: 'fb.1.987654.321098',
    ttclid: 'ttclid_live_123'
  },
  custom_data: {
    city: 'Karachi',
    value: 1200,
    traffic_type: 'paid'
  },
  gclid: 'gclid_live_123'
};

console.log('Sending POST to Al Hidaya API:', url);
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(async (response) => {
  const status = response.status;
  const bodyText = await response.text();
  console.log(`Response Status: ${status}`);
  console.log(`Response Body: ${bodyText}`);
})
.catch((error) => {
  console.error('Error posting to Al Hidaya API:', error);
});
