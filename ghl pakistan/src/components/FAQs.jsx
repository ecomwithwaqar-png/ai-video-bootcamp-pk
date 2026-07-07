import React, { useState } from 'react'

function FAQs() {
  const faqs = [
    {
      q: 'Is this for beginners?',
      a: 'Yes. This masterclass is completely beginner-friendly. Even if you’re totally new to this space, you’ll learn how to understand the tools, build automation systems, sell them to clients, and work toward building a $3,500/month business in the coming weeks.'
    },
    {
      q: 'Do you offer a refund policy?',
      a: 'Yes, if you implement our strategy consistently for 12 weeks, keep improving, and still don’t see a single result, you’ll get your money refunded. That means your investment is 100% safe, but only for action takers.'
    },
    {
      q: 'I’m a 9–5 employee. Should I join?',
      a: 'Yes, especially if you’re stuck in a 9–5. You can start part-time by investing just 2 to 2.5 hours per day while keeping your job. Build your freelance income stream on the side — and once it replaces your salary, you can shift to full-time.'
    },
    {
      q: 'What are the requirements to join this masterclass?',
      a: 'You only need basic English communication skills if you want to work with international clients. No technical background. No prior experience. Just willingness to learn and take action.'
    },
    {
      q: 'Is it live or recorded?',
      a: 'This is a pre-recorded masterclass. You’ll get HD video lessons that you can watch anytime, at your own pace. No pressure. No fixed schedule.'
    },
    {
      q: 'Do I need coding or a technical background?',
      a: 'No. You don’t need any coding skills, technical background, or degree to join this masterclass. Everything is built using simple, visual drag-and-drop tools — beginner-friendly and easy to understand.'
    }
  ]

  const [openIdx, setOpenIdx] = useState(null)

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', marginBottom: '12px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Got questions? We have answers to help you get started on your GHL automation journey.
          </p>
        </div>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div 
                key={idx} 
                className="glass-card" 
                style={{ 
                  padding: '20px', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: isOpen ? '1px solid var(--border-hover)' : '1px solid var(--border-color)',
                  background: isOpen ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  transition: 'all var(--transition-fast)'
                }}
                onClick={() => toggleFaq(idx)}
              >
                {/* Question */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                    {faq.q}
                  </h3>
                  <span style={{ fontSize: '1.25rem', color: 'var(--primary)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', display: 'inline-block', lineHeight: 1 }}>
                    +
                  </span>
                </div>
                
                {/* Answer */}
                <div 
                  style={{ 
                    maxHeight: isOpen ? '500px' : '0', 
                    overflow: 'hidden', 
                    opacity: isOpen ? 1 : 0,
                    transition: 'all var(--transition-normal)',
                    marginTop: isOpen ? '12px' : '0'
                  }}
                >
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default FAQs
