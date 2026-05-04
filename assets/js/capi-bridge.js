const CAPIBridge = (function () {
    const PIXEL_ID = '993205486461512';

    function generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function isAdTraffic() {
        const params = new URLSearchParams(window.location.search);
        return params.has('fbclid') || params.has('utm_source');
    }

    // Sends event to both Pixel and CAPI
    function track(eventName, standardParams = {}, customParams = {}, userData = {}) {
        const eventId = generateEventId();
        const trafficType = isAdTraffic() ? 'paid' : 'organic';

        // --- 1. Browser Pixel (PURE STANDARD ONLY) ---
        // We only send standard Meta parameters to the Pixel to ensure "Standard Event" status.
        // We do NOT send traffic_type here; we send it via CAPI. Meta will merge them using the eventId.
        if (window.fbq) {
            fbq('track', eventName, standardParams, { eventID: eventId });
        }

        // --- 2. Server-Side CAPI (RICH DATA) ---
        // This is where we send the 'traffic_type' and other custom labels.
        const payload = {
            event_name: eventName,
            event_id: eventId,
            event_source_url: window.location.href,
            user_data: userData,
            custom_data: {
                ...standardParams,
                ...customParams,
                traffic_type: trafficType
            }
        };

        fetch('/api/capi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify(payload)
        }).catch(() => {});
    }

    return {
        pageView: function () {
            track('PageView');
        },
        initiateCheckout: function () {
            track('InitiateCheckout', {
                content_name: 'AI Video Bootcamp',
                currency: 'PKR',
                value: 3500
            });
        },
        purchase: function (method = 'whatsapp_click') {
            track('Purchase', {
                content_name: 'AI Video Bootcamp',
                currency: 'PKR',
                value: 3500
            }, {
                method: method
            });
        }
    };
})();

function onReady(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
}

onReady(function () {
    CAPIBridge.pageView();
});
