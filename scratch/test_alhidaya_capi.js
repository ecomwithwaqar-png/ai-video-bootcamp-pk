const url = 'https://alhidaya-zeta.vercel.app/api/capi';
console.log('Fetching:', url);
fetch(url)
  .then(async (response) => {
    const status = response.status;
    const bodyText = await response.text();
    console.log(`Response Status: ${status}`);
    console.log(`Response Body: ${bodyText}`);
  })
  .catch((error) => {
    console.error('Error fetching Al Hidaya API:', error);
  });
