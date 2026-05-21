import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/about' },
  { label: 'Scent Quiz', to: '/quiz' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <motion.header
      className="navbar"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <NavLink className="brand" to="/">
        <span className="brand-mark">D</span>
        <span>DSCENT.NG</span>
      </NavLink>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="nav-actions">
        <NavLink className="cart-link" to="/cart" aria-label={`Cart with ${cartCount} items`}>
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
        </NavLink>
        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="icon-button"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {isMenuOpen && (
        <motion.nav
          animate={{ opacity: 1, y: 0 }}
          className="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={closeMenu}>
              {item.label}
            </NavLink>
          ))}
        </motion.nav>
      )}
    </motion.header>
  )
}
