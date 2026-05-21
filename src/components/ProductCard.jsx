import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react'
import { useAddToCartFeedback } from '../hooks/useAddToCartFeedback.js'
import { incrementWhatsappClick } from '../services/analyticsService.js'
import RatingDisplay from './RatingDisplay.jsx'
import { formatPrice, getNumericPrice } from '../utils/formatPrice.js'

export default function ProductCard({
  category,
  id,
  imageUrl,
  name,
  oldPrice,
  price,
  rating,
  reviewCount,
  scentType,
  showWhatsappOrder = false,
  topPick,
  viewLabel = 'View',
}) {
  const product = { category, id, imageUrl, name, price, scentType }
  const { handleAddToCart, wasAdded } = useAddToCartFeedback(product)
  const currentPrice = getNumericPrice(price)
  const previousPrice = getNumericPrice(oldPrice)
  const hasDiscount = previousPrice > currentPrice && currentPrice > 0
  const discountPercentage = hasDiscount
    ? Math.round(((previousPrice - currentPrice) / previousPrice) * 100)
    : 0
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.trim() || '2348174832431'
  const whatsappMessage = `Hello DSCENT.NG, I want to order ${name}.`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  function handleWhatsAppOrder() {
    incrementWhatsappClick(id).catch(() => {})
  }

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Link className="product-card-link" to={`/products/${id}`}>
        <div className="product-image">
          {imageUrl ? (
            <img alt={name} src={imageUrl} />
          ) : (
            <motion.div className="product-icon" whileHover={{ scale: 1.08 }}>
              <Sparkles size={19} />
            </motion.div>
          )}
          {topPick && <span className="top-pick-badge">Top Pick</span>}
        </div>
        <p className="product-mood">{category || 'Fragrance'}</p>
        <h3>{name}</h3>
        <RatingDisplay rating={rating} reviewCount={reviewCount} />
        <p>{scentType || 'Signature scent'}</p>
        <div className="product-card-bottom">
          <div className="product-price-row">
            <strong>{formatPrice(price)}</strong>
            {hasDiscount && (
              <>
                <span className="old-price">{formatPrice(oldPrice)}</span>
                <span className="discount-badge">-{discountPercentage}%</span>
              </>
            )}
          </div>
          <span className="product-card-cta">
            {viewLabel} <ArrowRight size={14} />
          </span>
        </div>
      </Link>
      <div className="product-card-actions">
        <button className="product-add-button" type="button" onClick={handleAddToCart}>
          <ShoppingBag size={16} />
          {wasAdded ? 'Added' : 'Add to Cart'}
        </button>
        {showWhatsappOrder && (
          <a
            className="product-whatsapp-button"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
            onClick={handleWhatsAppOrder}
          >
            <MessageCircle size={16} />
            Order on WhatsApp
          </a>
        )}
      </div>
    </motion.div>
  )
}
