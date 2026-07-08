import React from 'react'

function WhatsAppWidget() {
  const handleOpenChat = () => {
    const message = encodeURIComponent("Assalam-o-Alaikum! I have a question about the GHL Pakistan Masterclass.")
    window.open(`https://wa.me/923255090258?text=${message}`, '_blank')
  }

  return (
    <div className="wa-widget-container">
      <style>{`
        .wa-widget-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
        }

        .wa-bubble {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #25d366;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
        }

        .wa-bubble:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
        }

        .wa-bubble svg {
          width: 28px;
          height: 28px;
          fill: white;
        }

        /* Mobile specific floating rules to avoid overlapping with bottom sticky CTA on landing */
        @media (max-width: 768px) {
          .wa-widget-container {
            bottom: 88px !important; /* Floats above the sticky CTA capsule */
            right: 16px !important;
          }
          .wa-bubble {
            width: 46px;
            height: 46px;
            box-shadow: 0 4px 16px rgba(37, 211, 102, 0.25);
          }
          .wa-bubble svg {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>

      {/* Floating Bubble */}
      <div className="wa-bubble" onClick={handleOpenChat}>
        <svg viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.989 14.058 1.01 11.43 1.01c-5.442 0-9.866 4.372-9.87 9.802 0 1.689.472 3.336 1.366 4.793l-.994 3.634 3.725-.945zM15.82 13.06c-.323-.16-1.917-.93-2.213-1.036-.297-.109-.512-.16-.726.16-.215.321-.83.16-.108-.83-.16-.215-.324-.43-.43-.108-.321-.109-.526-.297-.526-.215 0-.43.109-.593.109-.161 0-.297-.053-.43-.16-.131-.109-1.127-1.077-1.127-2.188s.575-1.653.78-1.868c.205-.215.445-.269.66-.269.215 0 .43.053.62.053.195 0 .445-.073.68.16.236.236.903 2.169.98 2.329.077.16.131.347.026.559-.105.215-.215.347-.323.479-.109.13-.226.241-.323.347-.108.109-.22.226-.095.437.126.211.559.907 1.2 1.472.825.727 1.52 1.016 1.739 1.126.219.109.445.053.593-.109.148-.161.646-.738.82-1.012.176-.273.348-.22.563-.109.215.109 1.361.629 1.597.747.236.118.394.176.452.269.058.095.058.559-.103.882-.161.32-.942.64-1.328.663z"/>
        </svg>
      </div>
    </div>
  )
}

export default WhatsAppWidget
