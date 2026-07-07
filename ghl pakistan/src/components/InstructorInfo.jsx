import React from 'react'

function InstructorInfo() {
  const stats = [
    { value: '$1.2M+', label: 'Spent on Facebook Ads' },
    { value: '$50M+', label: 'Revenue Generated' },
    { value: '25,000+', label: 'Qualified Leads' },
    { value: '200+', label: 'Businesses Served' }
  ]

  return (
    <section style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="grid-2" style={{ alignItems: 'center' }}>
          
          {/* Left Panel: Stats and Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(186, 110, 238, 0.1)', border: '1px solid rgba(186, 110, 238, 0.2)', padding: '4px 12px', borderRadius: '4px', alignSelf: 'flex-start' }}>
              <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>🎓 Your Instructor</span>
            </div>
            
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', color: '#fff', lineHeight: 1.2 }}>
              Meet Zawar Ahmad
            </h2>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Hello, I'm Zawar Ahmad. I run an AI Marketing Automation agency. Today, I operate a <strong>$10K/MONTH</strong> marketing agency where I provide AI automation, AI receptionist agents, and marketing ad services to clients, charging <strong>$1,000–$1,500/month</strong> to manage their marketing and AI systems.
            </p>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              I don't just sell ads — I build complete AI marketing automation solutions! I create full AI marketing systems that handle customer support 24/7, qualify leads, book appointments, bring in more customers, and scale client businesses on autopilot.
            </p>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              In this masterclass, I'll show you exactly how you can build and sell these systems to clients and start making money in dollars.
            </p>
          </div>

          {/* Right Panel: Metrics Grid */}
          <div className="grid-2" style={{ gap: '16px' }}>
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="glass-card" 
                style={{ 
                  textAlign: 'center', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px', 
                  justifyContent: 'center', 
                  padding: '32px 16px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.03) 100%)' 
                }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default InstructorInfo
