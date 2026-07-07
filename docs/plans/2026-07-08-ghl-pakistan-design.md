# Design Document: GHL Pakistan Project (React + Vite)

**Date**: 2026-07-08  
**Topic**: GHL Pakistan Landing & Checkout Page  
**Status**: Approved  

---

## 1. Project Goals
Create a new sub-project under the directory `ghl pakistan/` which implements a high-converting landing page and checkout system based on `zawarahmad.com`, styled with modern premium dark aesthetics, and integrated with the checkout & event tracking systems of the `skool pakistan` root project.

---

## 2. Directory Structure
The new project will be scaffolded as a React + Vite application:

```
ghl pakistan/
├── index.html                  # Root HTML template loading Google Fonts and Pixel scripts
├── package.json                # Project dependencies and run scripts
├── vite.config.js              # Vite configuration
├── src/
│   ├── main.jsx                # React mount point
│   ├── App.jsx                 # Main component with state, page toggle, and tracking trigger
│   ├── index.css               # Global stylesheets, color tokens, and custom utility animations
│   ├── components/
│   │   ├── Hero.jsx            # Dynamic above-the-fold hero section with Urdu sub-headline
│   │   ├── TargetAudience.jsx  # Grid of who the course is for (Beginners, Freelancers, etc.)
│   │   ├── InstructorInfo.jsx  # Instructor bio, stats, and course screenshots
│   │   ├── CourseCurriculum.jsx# Course details, bonuses, value stack list, and refund guarantee
│   │   ├── Testimonials.jsx    # Real reviews masonry grid
│   │   ├── FAQs.jsx            # Accordion structure for FAQs
│   │   ├── Footer.jsx          # Compliance and policy links
│   │   ├── CheckoutPanel.jsx   # Form (Step 1) and Payment method tabs (Step 2) with order bumps
│   │   └── StickyCTA.jsx       # Floating CTA button for mobile screens
│   ├── lib/
│   │   └── capi-bridge.js      # React-friendly Meta/Google/TikTok CAPI tracking integration
│   └── assets/                 # SVGs and images
```

---

## 3. Visual & Style Design
*   **Fonts**: *Poppins* (headlines/UI labels) and *Inter* (body text) from Google Fonts, plus *Noto Nastaliq Urdu* for the translated sub-headline.
*   **Palette**:
    *   `--bg-dark`: `#04040c` (Very dark blue-black)
    *   `--bg-card`: `rgba(255, 255, 255, 0.03)` (Glass overlay)
    *   `--primary-purple`: `#ba6eee` (Brand accent purple)
    *   `--accent-gold`: `#ffc900` (Scarcity highlights)
    *   `--text-light`: `#ffffff`
    *   `--text-muted`: `#8893a8`
    *   `--border-color`: `rgba(255, 255, 255, 0.08)`
*   **Elements**: Dark ambient glowing orbs, smooth grid backdrops, CSS-based hover transitions, and a clean mobile-responsive layout.

---

## 4. E-Commerce & Checkout Flow
1.  **Price Matrix**:
    *   Base price: Rs. 1,999 (Discounted from Rs. 14,999)
    *   Upsell 1: AI Creator's Vault (+ Rs. 499)
    *   Upsell 2: Marketian Ads Masterclass (+ Rs. 999)
2.  **Scarcity Widgets**: Dynamic countdown indicating 3 spots left, updating periodically using cookie/session tracking or time-based epoch cycles.
3.  **Checkout Form**:
    *   **Step 1**: Contact info (Name, WhatsApp starting with `03`, City). Fires `Lead` event on completion.
    *   **Step 2**: Payments (EasyPaisa, JazzCash, HBL Bank). Shows details, rotates default tab dynamically by time (even vs. odd hours), copy buttons.
4.  **CTA WhatsApp Redirect**: Pre-fills order details and sends the user directly to support to submit payment screenshots.

---

## 5. Event Tracking (Meta CAPI)
*   **Attribution variables** (`fbclid`, `gclid`, `ttclid`, `_fbp`) captured and cached.
*   **Client Pixel events** and **Server CAPI calls** triggered:
    *   `PageView` (on load)
    *   `InitiateCheckout` (when clicking "Enroll Now" or switching to checkout)
    *   `Lead` (on Step 1 completion)
    *   `Purchase` (on clicking WhatsApp redirection button in Step 2)
*   Requests proxied to relative path `/api/capi` hosted on the Vercel app domain.
