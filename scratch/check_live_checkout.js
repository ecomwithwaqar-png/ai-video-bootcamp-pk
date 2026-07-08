const url = 'https://ai-video-bootcamp-pk.vercel.app/checkout';
console.log('Fetching:', url);
fetch(url)
  .then(async (response) => {
    const html = await response.text();
    if (html.includes('03180236635')) {
      console.log('✅ Success: New JazzCash number 03180236635 is live!');
    } else {
      console.log('❌ Failure: New JazzCash number not found in live HTML.');
    }
  })
  .catch((error) => {
    console.error('Error fetching live checkout:', error);
  });
