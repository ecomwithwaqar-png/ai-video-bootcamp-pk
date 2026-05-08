# Design Document: Meta Ads Tracking Optimization (Phase 1 & 2)

**Date:** 2026-05-08
**Topic:** Implementing Lead Capture and Full Funnel Tracking for Meta Ads.

## 1. Overview
The goal is to implement a robust tracking system for the AI Video Bootcamp project to support a "Fresh Start" Meta Ads campaign using the Sales objective. This involves tracking PageViews, Initiated Checkouts, Leads, and Purchases (WhatsApp Clicks) via both Browser Pixel and Server-side CAPI.

## 2. Architecture
The tracking system uses a hybrid approach:
- **Client-side:** Standard Meta Pixel `fbq` events.
- **Server-side:** Conversion API (CAPI) events sent via a Vercel Serverless Function (`/api/capi`).
- **Bridge:** A central `CAPIBridge` JavaScript utility to coordinate both tracking methods and ensure event deduplication using a shared `event_id`.

## 3. Implementation Details

### 3.1. `assets/js/capi-bridge.js`
Update the bridge to include:
- `lead(params, customData)`: Tracks the `Lead` event.
- Enhanced metadata: Include `traffic_type` and user city data where available.

### 3.2. `checkout-v2.html` Integration
- **Setup:**
    - Inject Meta Pixel base code.
    - Load `assets/js/capi-bridge.js`.
- **Event: Page Load**
    - Trigger `PageView`.
    - Trigger `InitiateCheckout` (standard for checkout pages).
- **Event: Step 1 Completion (Lead)**
    - Trigger `Lead` inside the `revealPayment()` function.
    - Include user name and city in the tracking payload.
- **Event: Step 2 Completion (Purchase)**
    - Trigger `Purchase` when the WhatsApp "I've Paid" button is clicked.

## 4. Success Criteria
- [ ] Events are visible in Meta Events Manager (both Browser and Server).
- [ ] Deduplication is active (sharing same `event_id`).
- [ ] Lead data is captured even if the user doesn't proceed to WhatsApp.

## 5. Next Steps
1. Update `capi-bridge.js`.
2. Update `checkout-v2.html`.
3. Verify event firing in the browser console.
