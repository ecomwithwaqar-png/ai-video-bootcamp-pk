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
    const pkPhoneRegex = /^(03|923|3)\d{9}$/
    if (!pkPhoneRegex.test(cleanPhone)) {
      alert('Please enter a valid Pakistani WhatsApp number (e.g., 03001234567).')
      return
    }

    // E.164 format normalization (+923XXXXXXXXX)
    let formattedPhone = cleanPhone
    if (cleanPhone.startsWith('03')) {
      formattedPhone = '+92' + cleanPhone.substring(1)
    } else if (cleanPhone.startsWith('923')) {
      formattedPhone = '+' + cleanPhone
    } else if (cleanPhone.startsWith('3') && cleanPhone.length === 10) {
      formattedPhone = '+92' + cleanPhone
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
    <section className="checkout-section">
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <div className="checkout-grid-container">
          
          {/* LEFT PANEL: Offer Information */}
          <div className="checkout-info-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Scarcity Banner */}
            <div className="glass-card desktop-only" style={{ borderLeft: '4px solid var(--accent)', padding: '16px 20px', background: 'rgba(255, 201, 0, 0.02)' }}>
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
            <div className="glass-card desktop-only" style={{ padding: '16px 20px', background: 'rgba(186, 110, 238, 0.02)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                💡 <strong>Return on Investment:</strong> Rs. 2,499 for GoHighLevel automation skillsets that digital agencies charge international clients <strong>$1,000 – $2,500/month</strong> for.
              </p>
            </div>

            {/* Scarcity Progress Bar */}
            <div className="glass-card desktop-only" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          <div className="checkout-form-panel">
            
            {/* Mobile-Only Order Summary */}
            <div className="mobile-summary mobile-only">
              <div className="mobile-summary-header">
                <span className="mobile-summary-title">ORDER SUMMARY</span>
                <span className="save-badge">Save 83%</span>
              </div>
              <div className="mobile-summary-pricing">
                <span className="price-mobile-val">Rs. {totalPrice.toLocaleString()}</span>
                <span className="price-was">Rs. 14,999</span>
              </div>
              <div className="mobile-summary-spots">
                <span>🔥</span> ONLY {spotsLeft} SPOTS LEFT AT THIS PRICE
              </div>
            </div>
            
            {step === 1 ? (
              /* STEP 1: LEAD FORM */
              <div className="checkout-card active">
                <div className="card-title">Step 1 of 2 — Your Enrollment Details</div>
                
                <form onSubmit={handleRevealPayment} className="checkout-form-steps">
                  
                  {/* Name */}
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Full Name (e.g. Muhammad Ali)" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="form-group">
                    <label>WhatsApp Number</label>
                    <input 
                      type="tel" 
                      placeholder="WhatsApp Number (03XX XXXXXXX)" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  {/* City */}
                  <div className="form-group">
                    <label>City</label>
                    <input 
                      type="text" 
                      placeholder="City (e.g. Lahore)" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  {/* Order Bump */}
                  <div 
                    onClick={() => setBump(!bump)}
                    className={`order-bump ${bump ? 'checked' : ''}`}
                  >
                    <div className="order-bump-header">
                      <input 
                        type="checkbox" 
                        checked={bump} 
                        onChange={() => {}} // toggled by outer container click
                        className="order-bump-checkbox"
                      />
                      <span className="order-bump-badge">PREMIUM UPGRADE</span>
                      <span className="order-bump-title">Add Marketian: Complete Facebook Ads Masterclass</span>
                    </div>
                    <div className="order-bump-desc">
                      Learn step-by-step how to write ad copy, design creatives, set up campaigns, budget, target local and international business, and scale client ad accounts.
                      <span className="order-bump-price">+ Rs. 999 (Save 80% today)</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn-reveal">
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
              <div className="checkout-card secure-payment-panel active">
                
                <div className="card-title">Step 2 of 2 — Send Payment & Confirm</div>

                {/* Scarcity Timer */}
                <div className="timer-box">
                  <span className="timer-text">Spot Reserved For:</span>
                  <span className="timer-clock">{formatTime(timeLeft)}</span>
                </div>

                {/* Payment Tabs */}
                <div className="pay-tabs">
                  {['jazz', 'easy', 'bank'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pay-tab ${activeTab === tab ? 'active' : ''}`}
                      data-tab={tab}
                    >
                      {tab === 'jazz' ? 'JazzCash' : tab === 'easy' ? 'EasyPaisa' : 'Bank Transfer'}
                    </button>
                  ))}
                </div>

                {/* Account Details Box */}
                <div className="pay-card active">
                  
                  <div className="pay-card-header">
                    <span className={`pay-method-name ${activeTab}`}>
                      {activeTab === 'jazz' ? 'JazzCash' : activeTab === 'easy' ? 'EasyPaisa' : 'HBL Bank Transfer'}
                    </span>
                    <span className="verified-chip">✓ VERIFIED</span>
                  </div>

                  <div className="pay-row">
                    <span className="pay-number">
                      {activeTab === 'jazz' ? '03180236635' : activeTab === 'easy' ? '03458996578' : '22567902223303'}
                    </span>
                    <button 
                      onClick={() => handleCopyText(activeTab === 'jazz' ? '03180236635' : activeTab === 'easy' ? '03458996578' : '22567902223303', activeTab)}
                      className="copy-btn"
                    >
                      {copiedField === activeTab ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  
                  <div className="pay-name">Account Name: <strong>Farman Ali</strong></div>
                  {activeTab === 'bank' && <div className="pay-name">Bank Name: <strong>Habib Bank Limited (HBL)</strong></div>}
                  
                  <div className="amount-chip">
                    <span>Amount to Send</span>
                    <span>Rs. {totalPrice.toLocaleString()}</span>
                  </div>

                </div>

                {/* Submit Screenshot Button */}
                <a 
                  href={waHref}
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppPurchase}
                  className="wa-cta"
                >
                  <svg className="wa-icon" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  I've Paid — Send Screenshot on WhatsApp
                </a>

                {/* Success Claims link */}
                <div className="already-paid">
                  <p>Already sent the screenshot?</p>
                  <a 
                    href="https://wa.me/923255090258?text=Hi,%20I%20have%20already%20sent%20the%20payment%20screenshot.%20Please%20approve%20my%20course%20enrollment." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                  >
                    Claim your instant access here →
                  </a>
                </div>

              </div>
            )}

            <div className="bottom-trust">
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
