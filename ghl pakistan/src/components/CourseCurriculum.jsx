import React from 'react'

function CourseCurriculum({ onNavigate }) {
  const inclusions = [
    { title: 'GoHighLevel AI Marketing Automation Tool Mastery', value: '$100' },
    { title: 'Client Acquisition Strategy', value: '$150' },
    { title: 'Client Service Fulfillment Blueprint', value: '$120' },
    { title: 'Facebook Ads Blueprint', value: '$50' },
    { title: 'BONUS 1: DM Outreach Scripts & Guide', value: '$100', isBonus: true },
    { title: 'BONUS 2: Sales Call Structure', value: '$250', isBonus: true },
    { title: 'BONUS 3: Private Support Premium Community (WA + FB)', value: '$250', isBonus: true },
    { title: 'BONUS 4: Direct Connect with Zawar', value: '$250', isBonus: true },
    { title: 'BONUS 5: Live Monthly Q&A Sessions', value: '$150', isBonus: true },
    { title: 'Fast Action Gift #1: Facebook Client Acquisition Strategy', value: '$100', isGift: true },
    { title: 'Fast Action Gift #2: Instagram DM Strategy', value: '$100', isGift: true },
    { title: 'Fast Action Gift #3: LinkedIn Client Acquisition Strategy', value: '$250', isGift: true },
    { title: 'Fast Action Gift #4: $500 Challenge Access', value: '$500', isGift: true }
  ]

  return (
    <section style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', marginBottom: '12px' }}>
            Program Inclusions &amp; Bonuses
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Here is a quick recap of everything you get when you enroll in the 2026 AI Marketing Automation Program 2.0 today.
          </p>
        </div>

        {/* Stack List */}
        <div className="glass-card" style={{ padding: '0 24px', marginBottom: '48px' }}>
          {inclusions.map((item, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '16px 0', 
                borderBottom: idx === inclusions.length - 1 ? 'none' : '1px solid var(--border-color)',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                <span style={{ fontSize: '0.92rem', color: item.isGift ? 'var(--accent)' : item.isBonus ? '#fdba74' : '#fff', fontWeight: (item.isGift || item.isBonus) ? 600 : 400 }}>
                  {item.title}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through', whiteSpace: 'nowrap' }}>
                {item.value}
              </div>
            </div>
          ))}
          
          {/* Total Value */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0 16px', borderTop: '2px solid var(--primary)', marginTop: '8px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Real Value:</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', textDecoration: 'line-through' }}>$2,120</span>
          </div>
        </div>

        {/* Guarantee Block */}
        <div 
          className="glass-card" 
          style={{ 
            border: '1px solid rgba(52, 211, 153, 0.2)', 
            background: 'linear-gradient(180deg, rgba(52, 211, 153, 0.03) 0%, rgba(255,255,255,0.01) 100%)',
            padding: '32px',
            borderRadius: '16px',
            marginBottom: '40px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛡️</div>
          <h3 style={{ fontSize: '1.3rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            The 12-Week Action-Taker Guarantee
          </h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.6, textAlign: 'left', margin: '0 auto', maxWidth: '720px' }}>
            I am really confident in this AI Marketing Automation Program 2.0. If you watch the complete program, apply everything exactly as taught, implement the positioning &amp; outreach system for 12 weeks, show proof of execution, and still do not get results... you can request a 100% refund. No excuses. Proof of implementation is required because this only works if you take action.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={onNavigate}
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 800,
              padding: '16px 36px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(186, 110, 238, 0.2)',
              textTransform: 'uppercase'
            }}
          >
            Claim Your Spot Now
          </button>
        </div>

      </div>
    </section>
  )
}

export default CourseCurriculum
