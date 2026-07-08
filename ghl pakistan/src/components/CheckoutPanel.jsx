import React, { useState, useEffect, useRef } from 'react'
import { CAPIBridge } from '../lib/capi-bridge'

function CheckoutPanel({ spotsLeft }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [bump, setBump] = useState(false)
  const [activeTab, setActiveTab] = useState('jazz')
  
  // Timer state (15 minutes)
  const [timeLeft, setTimeLeft] = useState(900)
  const [timerRunning, setTimerRunning] = useState(false)
  
  // Copy button feedback
  const [copiedField, setCopiedField] = useState(null)
  
  // WhatsApp redirect link
  const [waHref, setWaHref] = useState('#')

  // Calculate pricing dynamically
  const basePrice = 2499
  const bumpPrice = 999
  const totalPrice = basePrice + (bump ? bumpPrice : 0)

  // Rotate default payment tab based on the hour (even = EasyPaisa, odd = JazzCash)
  useEffect(() => {
    const currentHour = new Date().getHours()
    if (currentHour % 2 === 0) {
      setActiveTab('easy')
    } else {
      setActiveTab('jazz')
    }
  }, [])

  // Timer countdown hook
  useEffect(() => {
    let interval = null
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setTimerRunning(false)
    }
    return () => clearInterval(interval)
  }, [timerRunning, timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Handle Form Submission (Step 1)
  const handleRevealPayment = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      alert('Please enter your full name.')
      return
    }

    // Pakistani WhatsApp number validation
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '') // strip spaces, hyphens, pluses
    const pkPhoneRegex = /^03\d{9}$|^923\d{9}$/
    if (!pkPhoneRegex.test(cleanPhone)) {
      alert('Please enter a valid Pakistani WhatsApp number starting with 03 (e.g., 03001234567).')
      return
    }

    // E.164 format normalization (+923XXXXXXXXX)
    let formattedPhone = cleanPhone
    if (cleanPhone.startsWith('03')) {
      formattedPhone = '+92' + cleanPhone.substring(1)
    } else if (cleanPhone.startsWith('923')) {
      formattedPhone = '+' + cleanPhone
    }

    // Build the WhatsApp redirection link
    let offers = ['GHL Masterclass 2.0']
    if (bump) offers.push('Marketian Ads Course')
    const offerName = offers.join(' + ')

    const msg = encodeURIComponent(
      `Hi! I want to enroll in the ${offerName}.\n\nName: ${name}\nPhone: ${formattedPhone}\nCity: ${city || 'Not specified'}\n\nI am sending the payment of Rs. ${totalPrice} now. Please confirm my spot.`
    )
    
    // Support WhatsApp recipient: 923255090258
    setWaHref(`https://wa.me/923255090258?text=${msg}`)

    // Fire CAPI Lead event
    CAPIBridge.lead({
      city: city || 'Not specified',
      value: totalPrice,
      content_name: offerName
    }, {
      name: name,
      phone: formattedPhone
    })

    // Fire Google Ads Conversion lead event
    if (window.gtag) {
      const gads_eid = sessionStorage.getItem('meta_eid_lead') || ('gads_' + Date.now())
      window.gtag('set', 'user_data', {
        'phone_number': formattedPhone
      })
      window.gtag('event', 'conversion', {
        'send_to': 'AW-18059473078/z_ICCPCmhawcELbhtqND',
        'value': parseFloat(totalPrice),
        'currency': 'PKR',
        'transaction_id': gads_eid
      })
    }

    // Go to step 2 & start timer
    setStep(2)
    setTimerRunning(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle Copy details
  const handleCopyText = (textToCopy, fieldName) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  // Handle WhatsApp Click (Purchase)
  const handleWhatsAppPurchase = () => {
    let method = 'jazzcash'
    if (activeTab === 'easy') method = 'easypaisa'
    if (activeTab === 'bank') method = 'bank_transfer'
    
    CAPIBridge.purchase(totalPrice, method)
  }

  return (
    <section style={{ background: 'var(--bg-dark)', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }} className="checkout-grid-container">
          
          {/* LEFT PANEL: Offer Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Scarcity Banner */}
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent)', padding: '16px 20px', background: 'rgba(255, 201, 0, 0.02)' }}>
              <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                🚀 Launch Price — First 300 Students Only
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)' }}>Rs. {totalPrice.toLocaleString()}</span>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>Rs. 14,999</span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,201,0,0.1)', color: 'var(--accent)', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>Save 86%</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                One-time payment · Lifetime access
              </p>
            </div>

            {/* Value Proposition */}
            <div className="glass-card" style={{ padding: '16px 20px', background: 'rgba(186, 110, 238, 0.02)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                💡 <strong>Return on Investment:</strong> Rs. 2,499 for GoHighLevel automation skillsets that digital agencies charge international clients <strong>$1,000 – $2,500/month</strong> for.
              </p>
            </div>

            {/* Scarcity Progress Bar */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                <span style={{ color: '#fff' }}>{300 - spotsLeft} students enrolled</span>
                <span style={{ color: 'var(--accent)' }}>ONLY {spotsLeft} SPOTS LEFT</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${((300 - spotsLeft) / 300) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: '99px' }}></div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                🔴 Price jumps back to Rs. 14,999 once these spots are taken.
              </p>
            </div>

            {/* Core Inclusions List */}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 8px' }}>
              {['✓ Complete GoHighLevel Tool Training', '✓ Client Hunting Framework (GHL Leads)', '✓ Done-For-You DM Outreach Scripts', '✓ Facebook & Instagram Ads Blueprint', '✓ Private WhatsApp Premium Support Group', '✓ Lifetime Updates & Course Certification'].map((inc, i) => (
                <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span> {inc.substring(2)}
                </li>
              ))}
            </ul>

            {/* Testimonial Widget */}
            <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)', background: 'rgba(255, 255, 255, 0.015)' }}>
              <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--text-light)', lineHeight: 1.5 }}>
                "Best Rs. 2,499 I've ever spent. GHL lead search tools showed me hundreds of client emails in Faisalabad. closed my first dentist client in 4 days!"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.72rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-muted)' }}>— Hamza from Faisalabad</span>
                <span style={{ color: '#34d399' }}>✓ Earning Verified</span>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Checkout Steps */}
          <div>
            
            {step === 1 ? (
              /* STEP 1: LEAD FORM */
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(255, 255, 255, 0.015)', borderColor: 'rgba(186, 110, 238, 0.15)' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>Step 1 of 2 — Enrollment Details</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Enter your details to create your student account.</p>
                </div>
                
                <form onSubmit={handleRevealPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Muhammad Ali" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '0.9rem' }}
                      required
                    />
                  </div>

                  {/* WhatsApp */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>WhatsApp Number</label>
                    <input 
                      type="tel" 
                      placeholder="WhatsApp Number (03XX XXXXXXX)" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '0.9rem' }}
                      required
                    />
                  </div>

                  {/* City */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>City</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Lahore" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '0.9rem' }}
                    />
                  </div>

                  {/* Order Bump */}
                  <div 
                    onClick={() => setBump(!bump)}
                    style={{ 
                      border: '1px dashed var(--primary)', 
                      borderRadius: '8px', 
                      padding: '12px', 
                      background: bump ? 'rgba(186, 110, 238, 0.03)' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={bump} 
                      onChange={() => {}} // toggled by outer container click
                      style={{ marginTop: '3px' }} 
                    />
                    <div>
                      <span style={{ fontSize: '0.7rem', background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, marginRight: '6px' }}>PREMIUM UPGRADE</span>
                      <strong style={{ fontSize: '0.82rem', color: '#fff', display: 'block', margin: '4px 0 2px' }}>Add Marketian: Complete Facebook Ads Masterclass</strong>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        Learn step-by-step how to write ad copy, design creatives, set up campaigns, budget, target local and international business, and scale client ad accounts.
                      </p>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, display: 'block', marginTop: '4px' }}>+ Rs. 999 (Save 80% today)</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px 20px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px var(--primary-glow)',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#a95edd'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary)'}
                  >
                    🔐 Continue to Secure Payment →
                  </button>

                  <p style={{ fontSize: '0.72rem', color: '#fdba74', textAlign: 'center', fontWeight: 600 }}>
                    Aapko payment ke baad WhatsApp pe instant course access mil jayega — within 2 minutes.
                  </p>
                  
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    🔒 Secure checkout · EasyPaisa & JazzCash accepted · Instant activation
                  </p>

                </form>

              </div>
            ) : (
              /* STEP 2: SECURE PAYMENT */
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(255, 255, 255, 0.015)', borderColor: '#34d399' }}>
                
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>Step 2 of 2 — Send Payment &amp; Confirm</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Send payment to any verified account below and submit your screenshot.</p>
                </div>

                {/* Scarcity Timer */}
                <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <span style={{ color: '#fca5a5', fontWeight: 700 }}>⚠️ Spot Reserved For:</span>
                  <span style={{ color: '#ef4444', fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem' }}>{formatTime(timeLeft)}</span>
                </div>

                {/* Payment Tabs */}
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  {['jazz', 'easy', 'bank'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        flex: 1,
                        background: activeTab === tab ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)',
                        border: 'none',
                        color: 'white',
                        padding: '10px 8px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)'
                      }}
                    >
                      {tab === 'jazz' ? 'JazzCash' : tab === 'easy' ? 'EasyPaisa' : 'Bank Transfer'}
                    </button>
                  ))}
                </div>

                {/* Account Details Box */}
                <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                  
                  {activeTab === 'jazz' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', background: '#e93d3d', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>JazzCash</span>
                        <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>✓ VERIFIED ACCOUNT</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '6px', marginTop: '6px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>03180236635</span>
                        <button 
                          onClick={() => handleCopyText('03180236635', 'jazz')}
                          style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          {copiedField === 'jazz' ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Name: <strong>Farman Ali</strong></div>
                    </div>
                  )}

                  {activeTab === 'easy' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', background: '#37ca37', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>EasyPaisa</span>
                        <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>✓ VERIFIED ACCOUNT</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '6px', marginTop: '6px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>03458996578</span>
                        <button 
                          onClick={() => handleCopyText('03458996578', 'easy')}
                          style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          {copiedField === 'easy' ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Name: <strong>Farman Ali</strong></div>
                    </div>
                  )}

                  {activeTab === 'bank' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', background: '#188bf6', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>HBL Bank Transfer</span>
                        <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>✓ VERIFIED ACCOUNT</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '6px', marginTop: '6px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>22567902223303</span>
                        <button 
                          onClick={() => handleCopyText('22567902223303', 'bank')}
                          style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          {copiedField === 'bank' ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bank Name: <strong>Habib Bank Limited (HBL)</strong></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account Name: <strong>Farman Ali</strong></div>
                    </div>
                  )}

                  <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Amount to Send:</span>
                    <strong style={{ color: 'var(--accent)', fontSize: '0.95rem' }}>Rs. {totalPrice.toLocaleString()}</strong>
                  </div>

                </div>

                {/* Submit Screenshot Button */}
                <a 
                  href={waHref}
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppPurchase}
                  style={{
                    background: '#25d366',
                    color: 'white',
                    padding: '14px 20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#20ba56'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#25d366'}
                >
                  <svg style={{ width: '20px', height: '20px', fill: 'white' }} viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  I've Paid — Send Screenshot on WhatsApp
                </a>

                {/* Success Claims link */}
                <div style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Already sent the screenshot? </span>
                  <a 
                    href="https://wa.me/923255090258?text=Hi,%20I%20have%20already%20sent%20the%20payment%20screenshot.%20Please%20approve%20my%20course%20enrollment." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Claim your instant access here →
                  </a>
                </div>

              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>🔒 100% Secure</span>
              <span>⚡ Instant Activation</span>
              <span>🛡️ Content Guarantee</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default CheckoutPanel
