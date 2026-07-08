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
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(3, 3, 8, 0.95)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderTop: '1px solid var(--border-color)',
        padding: '12px 24px',
        zIndex: 999,
        boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
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
        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1.2 }}>
          Rs. 2,499
        </span>
        <span style={{ fontSize: '0.62rem', color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🔥 Only {spotsLeft} spots left!
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
          padding: '12px 20px',
          borderRadius: '8px',
          fontWeight: 800,
          fontSize: '0.82rem',
          cursor: 'pointer',
          textTransform: 'uppercase',
          textAlign: 'center',
          boxShadow: '0 4px 12px var(--primary-glow)',
          whiteSpace: 'nowrap'
        }}
      >
        Enroll Now →
      </button>
    </div>
  )
}

export default StickyCTA
