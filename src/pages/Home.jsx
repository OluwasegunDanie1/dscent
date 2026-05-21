import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ClipboardList, ShoppingBag } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { getProducts } from '../services/productService.js'

export default function Home() {
  const [topPicks, setTopPicks] = useState([])
  const [loadingTopPicks, setLoadingTopPicks] = useState(true)
  const [topPickError, setTopPickError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadTopPicks() {
      setLoadingTopPicks(true)
      setTopPickError('')

      try {
        const items = await getProducts()
        if (isMounted) {
          setTopPicks(items.filter((product) => product.topPick))
        }
      } catch (err) {
        if (isMounted) {
          setTopPickError(err.message || 'Unable to load top picks.')
        }
      } finally {
        if (isMounted) {
          setLoadingTopPicks(false)
        }
      }
    }

    loadTopPicks()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <motion.span
            className="eyebrow hero-badge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            Curated Fragrance Boutique
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: 'easeOut' }}
          >
            Smell Fresh. Look Better.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.42 }}
          >
            Discover elegant fragrances for every mood, moment, and memory.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.58, ease: 'easeOut' }}
          >
            <Link className="button primary" to="/products">
              <ShoppingBag size={18} />
              Shop Collection
            </Link>
            <Link className="button secondary" to="/quiz">
              <ClipboardList size={18} />
              Take Scent Quiz
            </Link>
          </motion.div>
        </div>
        <motion.div
          className="hero-visual-wrap"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.32, ease: 'easeOut' }}
        >
          <motion.div
            className="hero-visual"
            aria-label="DSCENT.NG perfume bottle display"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="perfume-bottle">
              <span>DSCENT.NG</span>
            </div>
          </motion.div>
          <div className="hero-note">
            <span>Smell Fresh. Look Better.</span>
            <strong>DSCENT.NG signature edit</strong>
          </div>
        </motion.div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <span className="eyebrow">Featured edit</span>
          <h2>Top Picks</h2>
          <Link className="text-link" to="/products">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        {topPickError && <p className="form-error">{topPickError}</p>}
        {loadingTopPicks ? (
          <p className="muted">Loading top picks...</p>
        ) : topPicks.length === 0 ? (
          <div className="empty-state">
            <h2>No top picks yet</h2>
            <p>Featured DSCENT.NG fragrances will appear here once products are marked as Top Pick.</p>
            <Link className="button secondary" to="/products">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {topPicks.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
