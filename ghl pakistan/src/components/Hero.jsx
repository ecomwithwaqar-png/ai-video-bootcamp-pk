import React from 'react'

function Hero({ onNavigate, spotsLeft, enrolledCount }) {
  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', padding: '60px 0 40px' }}>
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* Scarcity Banner */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 201, 0, 0.05)', border: '1px solid rgba(255, 201, 0, 0.2)', padding: '6px 16px', borderRadius: '99px', marginBottom: '24px' }}>
          <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 800 }}>⚡ DISCOUNT ENDING SOON! ENROLL TODAY!</span>
        </div>

        {/* Headlines */}
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15, fontWeight: 900, maxWidth: '960px', margin: '0 auto 16px' }}>
          Build a Long-Term Career with AI — <span style={{ color: 'var(--primary)' }}>No Investment Required!</span>
        </h1>
        
        <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: 'var(--text-light)', fontWeight: 600, maxWidth: '800px', margin: '0 auto 20px' }}>
          Master AI Marketing Automation and Start Earning $1,000 - $3,500/Month as a beginner.
        </p>

        {/* Urdu Sub-headline */}
        <p dir="rtl" className="hero-urdu-subtitle" style={{ fontFamily: 'var(--font-urdu)', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: 'var(--primary)', lineHeight: 1.8, margin: '10px auto 24px', maxWidth: '750px', textShadow: '0 0 20px rgba(186, 110, 238, 0.3)' }}>
          گھر بیٹھے اپنے موبائل اور لیپ ٹاپ سے AI مارکیٹنگ سیکھیں اور ڈالرز میں کمانا شروع کریں!
        </p>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          Even if you’re a complete beginner and have never done this before. We will guide you step-by-step on how to learn and sell automation services to international clients and make $1k – $3K+ by working just 2 – 3 hours a day from your home.
        </p>

        {/* CTA Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={onNavigate}
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              color: '#fff',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontWeight: 800,
              padding: '18px 36px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(186, 110, 238, 0.25)',
              transition: 'transform var(--transition-fast), opacity var(--transition-fast)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Enroll at Discounted Price Now
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
