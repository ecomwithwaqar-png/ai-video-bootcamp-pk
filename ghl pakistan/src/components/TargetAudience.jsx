import React from 'react'

function TargetAudience() {
  const audience = [
    { emoji: '🧑🏻‍💼', title: 'Beginners', desc: 'Step-by-step lessons (no experience needed). Follow a proven path to your first $1k.' },
    { emoji: '💸', title: 'Freelancers', desc: 'Turn $5 gigs into $1k+ retainers. Sell AI automations with GoHighLevel.' },
    { emoji: '📣', title: 'Digital Marketers', desc: 'Who want to close high ticket retainer clients and build their agency.' },
    { emoji: '📊', title: 'Ads Experts / Media Buyers', desc: 'Level up from running ads to delivering full AI marketing automation systems just like top agencies.' },
    { emoji: '⏰', title: '9–5 Employees', desc: 'Learn skills to escape the paycheck-to-paycheck grind. Build side income with AI systems.' },
    { emoji: '🏢', title: 'Agency Owners', desc: 'Offer high-ticket automation services instead of low-paying freelancer tasks.' },
    { emoji: '💻', title: 'Web Designers', desc: 'Upgrade websites with smart AI features. Offer higher-value services to clients.' }
  ]

  return (
    <section style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', marginBottom: '12px' }}>
            Who Is This Program For?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '640px', margin: '0 auto' }}>
            Perfect for beginners, freelancers, and professionals who want to add high-paying AI skills and earn $1,000–$3,500+/mo.
          </p>
        </div>

        <div className="grid-3">
          {audience.map((item, index) => (
            <div key={index} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{item.emoji}</span>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TargetAudience
