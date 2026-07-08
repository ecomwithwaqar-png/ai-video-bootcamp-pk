import React, { useState, useEffect } from 'react'

function StickyCTA({ onNavigate, spotsLeft }) {
  const [visible, setVisible] = useState(false)

  // Show only after scrolling down 300px to avoid cluttering above-the-fold content
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div 
      className="mobile-sticky-cta"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        right: '16px',
        background: 'rgba(15, 15, 27, 0.78)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '12px 20px',
        zIndex: 999,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <style>{`
        @media (min-width: 769px) {
          .mobile-sticky-cta {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Price & Scarcity */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1.1 }}>
          Rs. 2,499
        </span>
        <span style={{ fontSize: '0.6rem', color: '#fca5a5', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="red-dot" style={{ width: '5px', height: '5px', background: '#ef4444', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px #ef4444', animation: 'dotPulse 1.2s infinite' }}></span>
          {spotsLeft} SPOTS LEFT
        </span>
      </div>

      {/* Button */}
      <button 
        onClick={onNavigate}
        style={{
          flexGrow: 1,
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          color: 'white',
          border: 'none',
          padding: '12px 18px',
          borderRadius: '10px',
          fontWeight: 800,
          fontSize: '0.85rem',
          cursor: 'pointer',
          textTransform: 'uppercase',
          textAlign: 'center',
          boxShadow: '0 4px 14px rgba(186, 110, 238, 0.35)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.5px'
        }}
      >
        Enroll Now 🚀
      </button>
    </div>
  )
}

export default StickyCTA
