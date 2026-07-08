# GHL Pakistan Project Scaffolding & Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a new sub-project under the directory `ghl pakistan` implementing a dark-themed premium landing page and checkout system inspired by `zawarahmad.com` and matching the tracking/conversion infrastructure of the Skool Pakistan root site.

**Architecture:** A static single-page application built on Vite + React. It will handle its own views (landing page and checkout toggle) in client-side states and proxy event tracking requests to the parent project's `/api/capi` endpoint on Vercel.

**Tech Stack:** React, Vite, Vanilla CSS, Lucide icons (or built-in inline SVGs for zero dependency speed).

---

### Task 1: Scaffold Vite + React Project
**Files:**
- Create: `ghl pakistan/`
- Run command: `npx -y create-vite@latest "ghl pakistan" --template react --no-interactive`
- Test: Verify project folders exist and `package.json` contains React dependencies.

**Step 1: Run scaffolding command**
Run: `npx -y create-vite@latest "ghl pakistan" --template react --no-interactive` in `e:\skool project`
Expected output: Success message and directory files populated.

**Step 2: Install baseline dependencies**
Run: `npm install` inside `e:\skool project\ghl pakistan`
Expected output: Complete npm install of react, react-dom, and vite.

**Step 3: Commit initial project scaffold**
Run:
```bash
git add "ghl pakistan/"
git commit -m "feat: scaffold react + vite project for ghl pakistan"
```

---

### Task 2: Setup CSS System & Fonts
**Files:**
- Modify: `ghl pakistan/src/index.css`
- Modify: `ghl pakistan/index.html`

**Step 1: Load Fonts**
Add font links (Poppins, Inter, Noto Nastaliq Urdu) in `ghl pakistan/index.html`.

**Step 2: Add CSS Variables & Globals**
Replace `ghl pakistan/src/index.css` with a clean design system (ambient orbs, black/indigo variables, reset, transitions).

**Step 3: Commit**
```bash
git add "ghl pakistan/src/index.css" "ghl pakistan/index.html"
git commit -m "style: define variables and import fonts for ghl pakistan"
```

---

### Task 3: Port Event Tracking Bridge
**Files:**
- Create: `ghl pakistan/src/lib/capi-bridge.js`

**Step 1: Adapt capi-bridge.js for React/ESModules**
Write the ES module version of `capi-bridge.js` that exports methods: `pageView()`, `viewContent()`, `lead()`, `initiateCheckout()`, `purchase()`. It will make fetch calls to standard relative path `/api/capi`.

**Step 2: Commit**
```bash
git add "ghl pakistan/src/lib/capi-bridge.js"
git commit -m "feat: add react-compatible CAPI tracking bridge"
```

---

### Task 4: Setup App Layout & Routing
**Files:**
- Modify: `ghl pakistan/src/App.jsx`
- Modify: `ghl pakistan/src/main.jsx`
- Delete: `ghl pakistan/src/App.css` (we use global index.css)

**Step 1: Clear App.css and update main.jsx**
Delete unnecessary CSS, update imports in `main.jsx`.

**Step 2: Build App.jsx router logic**
Implement standard toggles in `App.jsx` for showing either `LandingPage` or `CheckoutPage` state. Add attribution parameters catcher on mount. Trigger CAPI `PageView` and `ViewContent` inside `useEffect` on mount.

**Step 3: Commit**
```bash
git add "ghl pakistan/src/App.jsx" "ghl pakistan/src/main.jsx"
git commit -m "feat: setup app router page states and event trigger hooks"
```

---

### Task 5: Build UI Sections (Landing Page)
**Files:**
- Create: `ghl pakistan/src/components/Hero.jsx`
- Create: `ghl pakistan/src/components/TargetAudience.jsx`
- Create: `ghl pakistan/src/components/InstructorInfo.jsx`
- Create: `ghl pakistan/src/components/CourseCurriculum.jsx`
- Create: `ghl pakistan/src/components/Testimonials.jsx`
- Create: `ghl pakistan/src/components/FAQs.jsx`
- Create: `ghl pakistan/src/components/Footer.jsx`

**Step 1: Write Hero.jsx**
Features bold AI Marketing Automation headers, Urdu subtitle, trust ratings widget, and scrolling CTA button.

**Step 2: Write TargetAudience.jsx, InstructorInfo.jsx, and Curriculum**
Porting copywriting from `zawarahmad.com` customized to `Skool Pakistan` style.

**Step 3: Write Testimonials.jsx and FAQs.jsx**
Testimonial masonry wall and accordion questions.

**Step 4: Commit**
```bash
git add "ghl pakistan/src/components/"
git commit -m "feat: build landing page structure and components"
```

---

### Task 6: Build Checkout & Upsell Panel
**Files:**
- Create: `ghl pakistan/src/components/CheckoutPanel.jsx`
- Create: `ghl pakistan/src/components/StickyCTA.jsx`

**Step 1: Write CheckoutPanel.jsx**
Build the two-step form state inside React. Step 1 collects Name, Phone (validates starting with `03`), City. Step 2 shows the EasyPaisa/JazzCash details with dynamic hourly rotation and copyable fields. Integrates Order Bumps for Cheat Code Vault (+499) and Marketian Ads Masterclass (+999).

**Step 2: Write WhatsApp redirect integration**
Generate pre-filled message with total payment value and open support link on click. Fire `Lead` on Step 1 submission, and `Purchase` on WhatsApp click.

**Step 3: Commit**
```bash
git add "ghl pakistan/src/components/CheckoutPanel.jsx" "ghl pakistan/src/components/StickyCTA.jsx"
git commit -m "feat: add secure checkout panel with payment rotation and order bumps"
```

---

### Task 7: Build Verification
**Files:**
- Run: `npm run build` inside `ghl pakistan`
- Run: `npm run dev` or test the local dev server.

**Step 1: Run Vite Production Build**
Expected: Success build output in `dist/` directory without error warnings.

**Step 2: Commit final build configuration**
```bash
git commit -am "chore: project builds successfully"
```
