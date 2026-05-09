// Global error tracker to catch hidden issues
window.addEventListener('error', function(e) {
    console.error('❌ [CAPIBridge] Global Error:', e.message, 'at', e.filename, 'line', e.lineno);
});

function onReady(fn) {
    console.log('[CAPIBridge] onReady check. State:', document.readyState);
    if (document.readyState !== 'loading') { 
        console.log('[CAPIBridge] onReady executing immediately');
        fn(); 
    } else { 
        console.log('[CAPIBridge] onReady waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[CAPIBridge] onReady DOMContentLoaded fired');
            fn();
        });
    }
}

console.log('🚀 [CAPIBridge] Script initialized');

window.CAPIBridge = (function () {
    // Configuration
    const TEST_EVENT_CODE = 'TEST72689'; // Matches the server-side code

    function generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function isAdTraffic() {
        const params = new URLSearchParams(window.location.search);
        const hasParams = params.has('fbclid') || params.has('utm_source') || params.has('utm_medium');
        
        if (hasParams) {
            sessionStorage.setItem('is_paid_traffic', 'true');
            return true;
        }
        
        return sessionStorage.getItem('is_paid_traffic') === 'true';
    }

    function track(eventName, standardParams = {}, customParams = {}, userData = {}) {
        const eventId = generateEventId();
        const trafficType = isAdTraffic() ? 'paid' : 'organic';

        console.log(`[CAPIBridge] Tracking ${eventName}`, { eventId, standardParams, customParams, userData });

        // 1. Browser Pixel
        if (window.fbq) {
            // Combine parameters for the browser pixel
            const pixelParams = { ...standardParams, ...customParams };
            
            // For Pixel, we don't send the user_data here (it's handled via init or automatic matching)
            // But we MUST send the eventID for deduplication
            fbq('track', eventName, pixelParams, { eventID: eventId });
        } else {
            console.warn('[CAPIBridge] Meta Pixel (fbq) not found');
        }

        // 2. Server CAPI (Rich Data)
        // Map user data to Meta standard keys
        const mappedUserData = {};
        if (userData.phone) mappedUserData.ph = userData.phone.replace(/\D/g, '');
        if (userData.email) mappedUserData.em = userData.email.toLowerCase().trim();
        if (userData.external_id) mappedUserData.external_id = userData.external_id;
        if (userData.fn) mappedUserData.fn = userData.fn.toLowerCase().trim();
        
        const payload = {
            event_name: eventName,
            event_id: eventId,
            event_source_url: window.location.href,
            user_data: mappedUserData,
            custom_data: {
                ...standardParams,
                ...customParams,
                traffic_type: trafficType
            },
            test_event_code: TEST_EVENT_CODE
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
                console.log(`[CAPIBridge] ✅ ${eventName} tracked successfully:`, data);
            } else {
                console.error(`[CAPIBridge] ❌ ${eventName} server error:`, data);
            }
        })
        .catch(err => {
            console.error(`[CAPIBridge] ❌ ${eventName} network error:`, err);
        });
    }

    return {
        pageView: function () { track('PageView'); },
        viewContent: function () {
            track('ViewContent', {
                content_name: 'AI Video Bootcamp',
                content_category: 'Online Course',
                content_ids: ['avb_001'],
                content_type: 'product',
                value: 1499,
                currency: 'PKR'
            });
        },
        lead: function (customParams = {}, userData = {}) {
            // Support both formats to be safe
            const normalizedUserData = { ...userData };
            if (!normalizedUserData.fn && normalizedUserData.name) normalizedUserData.fn = normalizedUserData.name;
            if (!normalizedUserData.phone && normalizedUserData.ph) normalizedUserData.phone = normalizedUserData.ph;

            track('Lead', {
                content_name: 'AI Video Bootcamp',
                content_category: 'Online Course',
                currency: 'PKR',
                value: 1499
            }, customParams, normalizedUserData);
        },
        initiateCheckout: function () {
            track('InitiateCheckout', {
                content_name: 'AI Video Bootcamp',
                content_ids: ['avb_001'],
                content_type: 'product',
                currency: 'PKR',
                value: 1499
            });
        },
        purchase: function (method = 'whatsapp_click') {
            track('Purchase', {
                content_name: 'AI Video Bootcamp',
                content_ids: ['avb_001'],
                content_type: 'product',
                currency: 'PKR',
                value: 1499
            }, {
                payment_method: method
            });
        }
    };
})();
