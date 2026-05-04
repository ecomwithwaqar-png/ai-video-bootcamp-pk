const CAPIBridge = (function () {
    function generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function isAdTraffic() {
        const params = new URLSearchParams(window.location.search);
        return params.has('fbclid') || params.has('utm_source');
    }

    // Sends event to server-side CAPI ONLY
    function track(eventName, standardParams = {}, customParams = {}, userData = {}) {
        const eventId = generateEventId();
        const trafficType = isAdTraffic() ? 'paid' : 'organic';

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
