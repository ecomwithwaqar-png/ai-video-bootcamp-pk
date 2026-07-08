import { useState, useEffect } from 'react'
import { CAPIBridge } from './lib/capi-bridge'
import Hero from './components/Hero'
import TargetAudience from './components/TargetAudience'
import CourseCurriculum from './components/CourseCurriculum'
import Testimonials from './components/Testimonials'
import FAQs from './components/FAQs'
import Footer from './components/Footer'
import CheckoutPanel from './components/CheckoutPanel'
import StickyCTA from './components/StickyCTA'
import WhatsAppWidget from './components/WhatsAppWidget'

function App() {
  const [page, setPage] = useState('landing') // 'landing' or 'checkout'
  const [spotsLeft, setSpotsLeft] = useState(3)
  const [enrolledCount, setEnrolledCount] = useState(297)

  // Scarcity simulation matching root logic (cyclical based on date)
  useEffect(() => {
    const epochDays = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const cycleDay = epochDays % 4; // 0, 1, 2, 3
    const calculatedSpots = 5 - cycleDay; // 5, 4, 3, 2
    setSpotsLeft(calculatedSpots);
    setEnrolledCount(300 - calculatedSpots);
  }, []);

  // Track PageView and ViewContent on initial load
  useEffect(() => {
    CAPIBridge.pageView();
    // Fire ViewContent 500ms later to avoid events clashing
    const timer = setTimeout(() => {
      CAPIBridge.viewContent();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Toggle page state with tracking and scroll reset
  const handleNavigate = (targetPage) => {
    setPage(targetPage);
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (targetPage === 'checkout') {
      CAPIBridge.initiateCheckout();
    }
  };

  return (
    <div className="app-layout">
      {/* Glow Orbs */}
      <div className="glow-orb" style={{ top: '10%', left: '-10%', width: '400px', height: '400px', background: 'var(--primary-glow)' }}></div>
      <div className="glow-orb" style={{ top: '45%', right: '-10%', width: '500px', height: '500px', background: 'var(--secondary-glow)' }}></div>
      <div className="glow-orb" style={{ bottom: '5%', left: '10%', width: '450px', height: '450px', background: 'var(--primary-glow)' }}></div>

      {/* Navbar */}
      <nav>
        <div className="container nav-container">
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); handleNavigate('landing'); }}>
            <span>GHL</span>Pakistan
          </a>
          <div className="nav-actions">
            {/* Desktop Spots Badge */}
            <div className="spots-badge desktop-only">
              <span>🔥 ONLY {spotsLeft} SPOTS LEFT</span>
              <div className="spots-bar">
                <div className="spots-fill" style={{ width: `${((300 - spotsLeft) / 300) * 100}%` }}></div>
              </div>
            </div>

            {/* Mobile Compact Spots Badge */}
            {page === 'landing' && (
              <div className="spots-badge mobile-only" style={{ background: 'rgba(255, 201, 0, 0.08)', borderColor: 'rgba(255, 201, 0, 0.35)', padding: '5px 10px', fontSize: '0.72rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulsing-dot" style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px var(--accent)', animation: 'dotPulse 1.5s infinite' }}></span>
                <span style={{ fontWeight: 800 }}>{spotsLeft} SPOTS LEFT</span>
              </div>
            )}

            {page === 'landing' ? (
              <button className="btn-nav desktop-only" onClick={() => handleNavigate('checkout')}>
                Enroll Now →
              </button>
            ) : (
              <button className="btn-nav" style={{ background: 'transparent', border: '1px solid var(--border-color)', boxShadow: 'none' }} onClick={() => handleNavigate('landing')}>
                ← Back
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content-wrapper" style={{ paddingTop: '72px' }}>
        {page === 'landing' ? (
          <>
            <Hero onNavigate={() => handleNavigate('checkout')} spotsLeft={spotsLeft} enrolledCount={enrolledCount} />
            <TargetAudience />
            <CourseCurriculum onNavigate={() => handleNavigate('checkout')} />
            <Testimonials />
            <FAQs />
          </>
        ) : (
          <CheckoutPanel spotsLeft={spotsLeft} enrolledCount={enrolledCount} />
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Sticky CTA */}
      {page === 'landing' && (
        <StickyCTA onNavigate={() => handleNavigate('checkout')} spotsLeft={spotsLeft} />
      )}

      {/* Floating WhatsApp Help Widget */}
      <WhatsAppWidget />
    </div>
  )
}

export default App
