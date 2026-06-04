# Kids Landing Page (kids.html) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a stunning, high-converting, "god level" summer landing page (`kids.html` / `/kids`) targeting parents and kids, leveraging the visual assets, storytelling copy, custom cursor, and layout patterns from the summer ad HTML, while retaining the main page's tracking pixels, CAPI bridge integration, and checkout funnel.

**Architecture:** Create a self-contained, beautifully styled `kids.html` in the root workspace folder. Point all Call-To-Action (CTA) buttons directly to `/checkout` (which maps to `checkout.html` and the payment verification funnel). Replicate the identical tracking setup (Meta Pixel `1622955485439618`, TikTok Pixel `D825I1JC77U9B8E8SBI0`, Google Tag `AW-18059473078`, and CAPI Bridge pageView/viewContent events) to prevent any tracking discrepancies. Re-use the live social proof signup popups and floating WhatsApp support widget to maximize conversions.

**Tech Stack:** Semantic HTML5, CSS Variables, Vanilla CSS for premium styling, Google Fonts (Unbounded, Noto Nastaliq Urdu, DM Sans), and Vanilla JavaScript for custom cursors, scroll animation triggers, tickers, and tracking events.

---

## User Review Required

> [!IMPORTANT]
> **Checkout Routing Alignment**
> The original ad file linked CTAs directly to WhatsApp (`https://wa.me/...`). To maintain a consistent tracking funnel, user metrics, and payment automation, **all primary checkout buttons on `/kids` will route to `/checkout`** (the main checkout page), exactly like `index.html`. We will still keep the floating WhatsApp support button for customer assistance, maintaining full functionality.

> [!NOTE]
> **Google Ads & Legal Compliance**
> To ensure the page complies with Google Ads policies, we are integrating:
> 1. A conspicuous **Earnings Disclaimer** in the Hero section (explaining that results vary and are not typical).
> 2. A comprehensive **Legal Disclaimer Block** in the footer, matching the main landing page.
> 3. Clickable navigation links for **Privacy Policy** and **Terms of Service** in the footer.

---

## Proposed Changes

### Core Pages & Sitemap

#### [NEW] [kids.html](file:///e:/skool%20project/kids.html)
A premium, summer-themed, parents/kids target page using:
- **Fonts**: Unbounded (headings), Noto Nastaliq Urdu (Urdu text), DM Sans (body)
- **Theme**: Ink background (`#0a0a0a`), Cream text (`#f5f0e8`), and Gold accents (`#e8b84b`)
- **Key Sections**:
  1. **Navbar**: Consistent header with logo, remaining spots indicator, and `/checkout` redirect
  2. **Hero**: VVS Summer hook, Urdu headline, price block, and CTA with Earnings Disclaimer for Google Ads compliance
  3. **Continuous Scrolling Ticker**: Student earnings highlights with gold dividers
  4. **Reality Check (Pain Cards)**: 4 cards targeting summer boredom and wasted time with interactive numbers and Urdu sub-captions
  5. **The Choice (VS Table)**: A stunning side-by-side comparison ("This Summer Without Us" vs "This Summer With AIBootcamp")
  6. **What You'll Build (Phone Mockups)**: Interactive 3D phone stack showcasing deliverables (cinematic ads, faceless influencers, UGC characters) and expected outcomes
  7. **Student Testimonials**: High-converting visual cards containing Urdu quotes, star ratings, and earnings tags
  8. **The Curriculum**: 10 clean, grid-aligned, kids-friendly modules
  9. **Summer 2026 Countdown**: Visual urgency spots indicator (33 remaining) and countdown details
  10. **Video Ad Storyboard**: A step-by-step visual storyboard walkthrough for Reel/TikTok ad hooks
  11. **Final Urgency CTA**: Direct checkout CTA block with footnote payment context
  12. **Social Proof Notification Popup**: Live updates of recent signups (e.g. "Zain from Karachi just joined...")
  13. **Floating WhatsApp Widget**: Corner button for parent inquiries
  14. **Custom Cursor Follower**: Interactive gold pointer with hover expansion effects
  15. **Scroll Reveal System**: IntersectionObserver-based animations for elements to fade and slide in beautifully

#### [MODIFY] [sitemap.xml](file:///e:/skool%20project/sitemap.xml)
Include the kids landing page in the indexable sitemap:
```xml
  <url>
    <loc>https://aivideobootcamp.online/kids</loc>
    <lastmod>2026-05-27</lastmod>
    <priority>0.9</priority>
  </url>
```

---

## Technical Details

### Tracking Replicas (Crucial)
```html
<!-- Google Tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18059473078"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'AW-18059473078', { 'allow_enhanced_conversions': true });
</script>

<!-- Meta Pixel Code -->
<script>
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }; if (!f._fbq) f._fbq = n;
        n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
    }(window,
        document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1622955485439618');
</script>

<!-- TikTok Pixel Code -->
<script>
    !function (w, d, t) {
        w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"], ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++)ttq.setAndDefer(ttq, ttq.methods[i]); ttq.instance = function (t) {
            for (
                var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)ttq.setAndDefer(e, ttq.methods[n]); return e
        }, ttq.load = function (e, n) {
            var r = "https://analytics.tiktok.com/i18n/pixel/events.js", o = n && n.partner; ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = r, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {}; n = document.createElement("script")
                ; n.type = "text/javascript", n.async = !0, n.src = r + "?sdkid=" + e + "&lib=" + t; e = document.getElementsByTagName("script")[0]; e.parentNode.insertBefore(n, e)
        };
        ttq.load('D825I1JC77U9B8E8SBI0');
        ttq.page();
    }(window, document, 'ttq');
</script>
<script src="assets/js/capi-bridge.js?v=1.0.5"></script>
<noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=1622955485439618&ev=PageView&noscript=1" /></noscript>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        if (window.CAPIBridge) {
            CAPIBridge.pageView();
            setTimeout(function () { CAPIBridge.viewContent(); }, 500);
        }
    });
</script>
```

---

## Verification Plan

### Automated Tests
- Validate HTML structure using `npx html-validator-cli` or similar tools if applicable.
- Confirm Vercel Clean URLs works perfectly locally.

### Manual Verification
1. **Visual Perfection**: Open `kids.html` in browser and confirm that responsive layouts, custom cursor follower, text sizes, scroll fade animations, vs-table spacing, and Urdu nastaliq look flawless.
2. **Checkout Validation**: Click all checkout CTAs and ensure they route correctly to `/checkout` with proper layout parameters.
3. **Tracking Diagnostics**: Open the browser's developer console and inspect network activity. Ensure that `pageView` and `viewContent` triggers occur, making successful post requests to `/api/capi` with normal parameters.
4. **Sitemap validation**: Check that `sitemap.xml` contains the new `/kids` URL correctly structured.
