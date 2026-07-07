// CAPI tracking bridge for GHL Pakistan React App

// Helper: check if we are in browser environment
const isBrowser = typeof window !== 'undefined';

function captureFbc() {
  if (!isBrowser) return null;
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');
  if (fbclid) {
    const fbc = 'fb.1.' + Date.now() + '.' + fbclid;
    localStorage.setItem('meta_fbc', fbc);
    console.log('[CAPIBridge] ✅ fbc captured:', fbc);
    return fbc;
  }
  return localStorage.getItem('meta_fbc') || null;
}

function getFbp() {
  if (!isBrowser) return null;
  const match = document.cookie.match(/(^|;)\s*_fbp=([^;]+)/);
  const fbp = match ? match[2] : null;
  if (fbp) localStorage.setItem('meta_fbp', fbp);
  return fbp || localStorage.getItem('meta_fbp') || null;
}

function captureGclid() {
  if (!isBrowser) return null;
  const params = new URLSearchParams(window.location.search);
  const gclid = params.get('gclid');
  if (gclid) {
    localStorage.setItem('google_click_id', gclid);
    console.log('[CAPIBridge] ✅ gclid captured:', gclid);
    return gclid;
  }
  return localStorage.getItem('google_click_id') || null;
}

function captureTtclid() {
  if (!isBrowser) return null;
  const params = new URLSearchParams(window.location.search);
  const ttclid = params.get('ttclid');
  if (ttclid) {
    localStorage.setItem('tiktok_click_id', ttclid);
    console.log('[CAPIBridge] ✅ ttclid captured:', ttclid);
    return ttclid;
  }
  return localStorage.getItem('tiktok_click_id') || null;
}

function isAdTraffic() {
  if (!isBrowser) return false;
  const params = new URLSearchParams(window.location.search);
  const hasParams = params.has('fbclid') || params.has('utm_source') || params.has('utm_medium') || params.has('gclid') || params.has('ttclid');
  if (hasParams) {
    localStorage.setItem('is_paid_traffic', 'true');
    return true;
  }
  return localStorage.getItem('is_paid_traffic') === 'true';
}

// Perform captures immediately on import
if (isBrowser) {
  captureFbc();
  captureGclid();
  captureTtclid();
}

function track(eventName, standardParams = {}, customParams = {}, userData = {}) {
  if (!isBrowser) return;

  const sessionKey = `meta_eid_${eventName.toLowerCase()}`;
  let eventId = sessionStorage.getItem(sessionKey);
  let isNewEvent = false;

  if (!eventId) {
    eventId = 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem(sessionKey, eventId);
    isNewEvent = true;
    console.log(`[CAPIBridge] Generated NEW ID for ${eventName}: ${eventId}`);
  } else {
    console.log(`[CAPIBridge] Reusing LOCKED ID for ${eventName}: ${eventId}`);
  }

  const trafficType = isAdTraffic() ? 'paid' : 'organic';

  // 1. Meta Browser Pixel
  if (window.fbq && isNewEvent) {
    const pixelParams = { ...standardParams, ...customParams };
    window.fbq('track', eventName, pixelParams, { eventID: eventId });
  }

  // 2. TikTok Browser Pixel
  if (window.ttq && isNewEvent) {
    const ttEventMap = {
      'Purchase': 'CompletePayment',
      'Lead': 'SubmitForm',
      'InitiateCheckout': 'InitiateCheckout',
      'PageView': 'PageView'
    };
    const ttEventName = ttEventMap[eventName] || eventName;
    window.ttq.track(ttEventName, {
      ...standardParams,
      ...customParams
    }, { event_id: eventId });
  }

  // 3. Server CAPI (Rich Data)
  const mappedUserData = {};
  if (userData.phone) mappedUserData.ph = userData.phone.replace(/\D/g, '');
  if (userData.email) mappedUserData.em = userData.email.toLowerCase().trim();
  if (userData.external_id) mappedUserData.external_id = userData.external_id;
  if (userData.fn) mappedUserData.fn = userData.fn.toLowerCase().trim();

  const fbc = captureFbc();
  const fbp = getFbp();
  if (fbc) mappedUserData.fbc = fbc;
  if (fbp) mappedUserData.fbp = fbp;

  const gclid = captureGclid();
  const ttclid = captureTtclid();

  const payload = {
    event_name: eventName,
    event_id: eventId,
    event_source_url: window.location.href,
    user_data: {
      ...mappedUserData,
      ttclid: ttclid
    },
    custom_data: {
      ...standardParams,
      ...customParams,
      traffic_type: trafficType
    },
    gclid: gclid || ''
  };

  fetch('/api/capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify(payload)
  })
    .then(async r => {
      const data = await r.json();
      if (r.ok) {
        console.log(`[CAPIBridge] ✅ ${eventName} CAPI tracked successfully:`, data);
      } else {
        console.error(`[CAPIBridge] ❌ ${eventName} CAPI error:`, data);
      }
    })
    .catch(err => {
      console.error(`[CAPIBridge] ❌ ${eventName} CAPI network error:`, err);
    });
}

export const CAPIBridge = {
  pageView: function () {
    track('PageView');
  },
  viewContent: function () {
    track('ViewContent', {
      content_name: 'GHL AI Marketing Masterclass',
      content_category: 'Online Course',
      content_ids: ['ghl_001'],
      content_type: 'product',
      value: 1999,
      currency: 'PKR'
    });
  },
  lead: function (customParams = {}, userData = {}) {
    const normalizedUserData = { ...userData };
    if (!normalizedUserData.fn && normalizedUserData.name) normalizedUserData.fn = normalizedUserData.name;
    if (!normalizedUserData.phone && normalizedUserData.ph) normalizedUserData.phone = normalizedUserData.ph;

    track('Lead', {
      content_name: 'GHL AI Marketing Masterclass',
      content_category: 'Online Course',
      currency: 'PKR',
      value: 1999
    }, customParams, normalizedUserData);
  },
  initiateCheckout: function (value = 1999) {
    track('InitiateCheckout', {
      content_name: 'GHL AI Marketing Masterclass',
      content_ids: ['ghl_001'],
      content_type: 'product',
      currency: 'PKR',
      value: value
    });
  },
  purchase: function (value = 1999, method = 'whatsapp_click') {
    track('Purchase', {
      content_name: 'GHL AI Marketing Masterclass',
      content_ids: ['ghl_001'],
      content_type: 'product',
      currency: 'PKR',
      value: value
    }, {
      payment_method: method
    });
  }
};
