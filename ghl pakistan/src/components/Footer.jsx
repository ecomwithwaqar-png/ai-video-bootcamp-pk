import React from 'react'

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-dark)', padding: '40px 0 96px' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        
        {/* Support Section */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 700 }}>
            Customer Support: <a href="https://wa.me/923000756971" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>0300 0756971</a> (WhatsApp Only!)
          </p>
        </div>

        {/* Brand */}
        <div style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
          <span style={{ color: 'var(--primary)' }}>GHL</span>Pakistan
        </div>

        {/* Links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <a href="#" style={{ hover: { color: '#fff' } }}>Privacy Policy</a>
          <a href="#" style={{ hover: { color: '#fff' } }}>Terms of Service</a>
          <a href="#" style={{ hover: { color: '#fff' } }}>Earnings Disclaimer</a>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Copyright &copy; 2024-2026. All rights reserved. GHLPakistan is an independent education portal and is not affiliated with GoHighLevel Inc.
        </p>

      </div>
    </footer>
  )
}

export default Footer
