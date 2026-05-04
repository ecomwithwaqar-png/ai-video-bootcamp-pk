
/**
 * Meta Conversions API (CAPI) Bridge
 * Sends server-side events to /api/capi alongside browser pixel events.
 * Deduplication is handled via matching event_id on both sides.
 */

const CAPIBridge = (function () {
    const PIXEL_ID = '993205486461512';

    // Generates a unique event ID for deduplication
    function generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Detects if traffic is from a paid ad
    function isAdTraffic() {
        const params = new URLSearchParams(window.location.search);
        return params.has('fbclid') || params.has('utm_source');
    }

    // Sends event to both the browser Pixel AND the server-side CAPI
    function track(eventName, customData = {}, userData = {}) {
        const eventId = generateEventId();
        const trafficType = isAdTraffic() ? 'paid' : 'organic';

        // --- 1. Browser Pixel (Client-Side) ---
        if (window.fbq) {
            fbq('track', eventName, {
                ...customData,
                traffic_type: trafficType
            }, {
                eventID: eventId  // <-- Deduplication key
            });
        }

        // --- 2. Server-Side CAPI (Bypass Ad Blockers) ---
        const payload = {
            event_name: eventName,
            event_id: eventId,  // <-- Same key for deduplication
            event_source_url: window.location.href,
            user_data: userData,
            custom_data: {
                ...customData,
                traffic_type: trafficType
            }
        };

        // Fire and forget — does not block the user's action
        fetch('/api/capi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,  // Ensures the request completes even if page navigates away
            body: JSON.stringify(payload)
        }).catch(() => {
            // Silent fail — browser pixel already captured the event
        });
    }

    // --- Pre-built event helpers ---
    return {
        pageView: function () {
            track('PageView');
        },
        initiateCheckout: function () {
            track('InitiateCheckout', { content_name: 'AI Video Bootcamp', currency: 'PKR', value: 3500 });
        },
        purchase: function (method = 'whatsapp_click') {
            track('Purchase', {
                content_name: 'AI Video Bootcamp',
                currency: 'PKR',
                value: 3500,
                method: method
            });
        }
    };
})();

// Auto-fire PageView on load
document.addEventListener('DOMContentLoaded', function () {
    CAPIBridge.pageView();
});
