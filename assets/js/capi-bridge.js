const CAPIBridge = (function () {
    function generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function isAdTraffic() {
        const params = new URLSearchParams(window.location.search);
        return params.has('fbclid') || params.has('utm_source');
    }

    function track(eventName, standardParams = {}, customParams = {}) {
        const eventId = generateEventId();
        const trafficType = isAdTraffic() ? 'paid' : 'organic';

        // 1. Browser Pixel (Standard Parameters ONLY for clean classification)
        if (window.fbq) {
            fbq('track', eventName, standardParams, { eventID: eventId });
        }

        // 2. Server CAPI (Rich Data including traffic_type)
        const payload = {
            event_name: eventName,
            event_id: eventId,
            event_source_url: window.location.href,
            user_data: {},
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
        pageView: function () { track('PageView'); },
        viewContent: function () {
            track('ViewContent', {
                content_name: 'AI Video Bootcamp',
                content_category: 'Online Course',
                value: 3500,
                currency: 'PKR'
            });
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
