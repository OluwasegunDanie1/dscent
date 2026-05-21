import { Link } from 'react-router-dom'
import { MessageCircle, Phone } from 'lucide-react'

function InstagramGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="contact-glyph"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="16" rx="5" stroke="currentColor" strokeWidth="2" width="16" x="4" y="4" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.8" cy="7.2" fill="currentColor" r="1" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-brand">DSCENT.NG</p>
        <p>Smell Fresh. Look Better.</p>
        <div className="footer-links">
          <Link to="/about">About</Link>
        </div>
      </div>
      <div className="footer-contact" aria-label="DSCENT.NG contact details">
        <a href="https://www.instagram.com/Dscent.ng" target="_blank" rel="noreferrer">
          <InstagramGlyph />
          @Dscent.ng
        </a>
        <a href="tel:07043789635">
          <Phone size={18} />
          07043789635
        </a>
        <a className="whatsapp-button" href="https://wa.me/2348174832431" target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
          Order on WhatsApp
        </a>
      </div>
    </footer>
  )
}
