import React from 'react'

function Testimonials() {
  const reviews = [
    { name: 'Hamza', city: 'Faisalabad', quote: "Best Rs. 2,499 I've ever spent. The client outreach scripts alone got me a $150 client on WhatsApp in 3 days!", badge: '✓ Earning Verified' },
    { name: 'Zeeshan', city: 'Rawalpindi', quote: "GHL automation is a game changer. I set up an automated lead booking system for a real estate client in Dubai and charged $400 upfront + $100 recurring.", badge: '✓ Active Agency' },
    { name: 'Usman', city: 'Faisalabad', quote: "As a beginner, I was lost. The Facebook Ads Blueprint and outreach templates gave me exact step-by-step guidance. Already closed my first client!", badge: '✓ First Client Closed' },
    { name: 'Bilal', city: 'Lahore', quote: "I work 9-5 and only get 2 hours a day. The pre-recorded video lessons are short and straight to the point. Highly recommended.", badge: '✓ Side Income Built' },
    { name: 'Ayesha', city: 'Karachi', quote: "I was selling content writing for $5. GHL tools allowed me to upsell automation to my old clients for $300/month. Earning verified.", badge: '✓ Earning Verified' }
  ]

  return (
    <section style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-dark)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>⭐⭐⭐⭐★</span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', marginBottom: '12px' }}>
            Real Student Results
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            See what students in Pakistan say after joining the AI Marketing Automation Masterclass.
          </p>
        </div>

        {/* Grid/Masonry Layout */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '20px' 
          }}
        >
          {reviews.map((rev, idx) => (
            <div 
              key={idx} 
              className="glass-card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px',
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                    {rev.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{rev.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>from {rev.city}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.65rem', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {rev.badge}
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{rev.quote}"
              </p>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px', marginTop: '56px', borderTop: '1px solid var(--border-color)', paddingTop: '40px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-light)' }}>4000+</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Students</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-light)' }}>4.9★</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Rating</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-light)' }}>98%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Satisfaction</div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Testimonials
