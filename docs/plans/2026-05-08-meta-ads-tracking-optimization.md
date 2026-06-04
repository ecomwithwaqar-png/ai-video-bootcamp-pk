# Meta Ads Tracking Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement robust Lead and Purchase tracking on the checkout page to support a "Fresh Start" Meta Ads campaign.

**Architecture:** A hybrid tracking system using a central JavaScript bridge to coordinate both Meta Pixel (browser) and Conversion API (server) events with shared deduplication IDs.

**Tech Stack:** JavaScript (ES6), Meta Pixel API, Node.js (Vercel Functions).

---

### Task 1: Update CAPI Bridge
**Files:**
- Modify: `assets/js/capi-bridge.js`

**Step 1: Add lead tracking method**
Modify `assets/js/capi-bridge.js` to include the `lead` function.

```javascript
// Add this inside the return object of CAPIBridge
lead: function (customParams = {}) {
    track('Lead', {
        content_name: 'AI Video Bootcamp',
        currency: 'PKR',
        value: 1499 // Optional: set to 0 if you prefer Lead to have no value
    }, customParams);
},
```

**Step 2: Commit**
```bash
git add assets/js/capi-bridge.js
git commit -m "feat: add lead event to CAPI bridge"
```

---

### Task 2: Integrate Tracking into Checkout Page
**Files:**
- Modify: `checkout-v2.html`

**Step 1: Add Meta Pixel and Bridge**
Modify `checkout-v2.html` to include the Pixel base code and the bridge script in the `<head>`.

```html
<!-- Meta Pixel Code -->
<script>
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1622955485439618');
</script>
<script src="assets/js/capi-bridge.js"></script>
<!-- End Meta Pixel Code -->
```

**Step 2: Initialize page-load events**
Add a script at the bottom of the `<body>` to track `PageView` and `InitiateCheckout`.

```javascript
onReady(function() {
    CAPIBridge.pageView();
    CAPIBridge.initiateCheckout();
});
```

**Step 3: Commit**
```bash
git add checkout-v2.html
git commit -m "feat: integrate tracking bridge and pixel into checkout-v2"
```

---

### Task 3: Implement Event Triggers
**Files:**
- Modify: `checkout-v2.html`

**Step 1: Trigger Lead event on "Reveal Payment"**
Update the `revealPayment()` function to call `CAPIBridge.lead()`.

```javascript
function revealPayment() {
    // ... existing validation ...
    const city = document.getElementById('inp-city').value;
    
    // Track Lead
    if (window.CAPIBridge) {
        CAPIBridge.lead({ city: city || 'Not specified' });
    }
    
    // ... rest of the function ...
}
```

**Step 2: Trigger Purchase event on WhatsApp click**
Update the WhatsApp CTA link to include a purchase trigger.

```html
<a class="wa-cta" id="waLink" href="#" target="_blank" onclick="if(window.CAPIBridge) CAPIBridge.purchase('whatsapp_click')">
    I've Paid — Send Screenshot on WhatsApp
</a>
```

**Step 3: Commit**
```bash
git add checkout-v2.html
git commit -m "feat: trigger Lead and Purchase events in checkout flow"
```

---

### Task 4: Final Verification
**Files:**
- Manual verification

**Step 1: Verify console logs**
Open the browser console and verify that `/api/capi` requests are being sent when buttons are clicked.

**Step 2: Commit**
```bash
git commit --allow-empty -m "chore: verification of tracking events complete"
```
