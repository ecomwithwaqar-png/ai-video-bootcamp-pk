import React from 'react'

function Hero({ onNavigate, spotsLeft, enrolledCount }) {
  return (
    <section className="hero-section">
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* Scarcity Banner */}
        <div className="hero-badge">
          <span>⚡ DISCOUNT ENDING SOON! ENROLL TODAY!</span>
        </div>

        {/* Headlines */}
        <h1 className="hero-title">
          Build a Long-Term Career with AI — <span>No Investment Required!</span>
        </h1>
        
        <p className="hero-subtitle">
          Master AI Marketing Automation and Start Earning $1,000 - $3,500/Month as a beginner.
        </p>

        {/* Urdu Sub-headline */}
        <p dir="rtl" className="hero-urdu-subtitle">
          گھر بیٹھے اپنے موبائل اور لیپ ٹاپ سے AI مارکیٹنگ سیکھیں اور ڈالرز میں کمانا شروع کریں!
        </p>

        <p className="hero-desc">
          Even if you’re a complete beginner and have never done this before. We will guide you step-by-step on how to learn and sell automation services to international clients and make $1k – $3K+ by working just 2 – 3 hours a day from your home.
        </p>

        {/* CTA Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={onNavigate}
            className="hero-cta-btn"
          >
            Enroll at Discounted Price Now 🚀
          </button>
          
          {/* Trust proof widget */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#4f46e5', border: '2px solid var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900 }}>A</div>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0891b2', border: '2px solid var(--bg-dark)', marginLeft: '-10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900 }}>K</div>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#16a34a', border: '2px solid var(--bg-dark)', marginLeft: '-10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900 }}>Z</div>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ea580c', border: '2px solid var(--bg-dark)', marginLeft: '-10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900 }}>M</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                ⭐ 4.9/5 <span style={{ color: 'var(--accent)' }}>★★★★★</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Trusted by <span>{enrolledCount}</span> students in Pakistan
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer-box">
          <strong>Compliance Disclaimer:</strong> Results vary based on effort, consistency, and market demand. InshaAllah, with dedication and practice, you can land high-ticket clients. View our <a href="#" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Earnings Policy</a>.
        </div>

      </div>
    </section>
  )
}

export default Hero
