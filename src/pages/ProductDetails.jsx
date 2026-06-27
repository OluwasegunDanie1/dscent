import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MessageCircle, ShoppingBag, Sparkles } from 'lucide-react'
import RatingDisplay from '../components/RatingDisplay.jsx'
import { useAddToCartFeedback } from '../hooks/useAddToCartFeedback.js'
import { incrementProductView } from '../services/analyticsService.js'
import { getProductById } from '../services/productService.js'
import { formatPrice } from '../utils/formatPrice.js'

const viewedProductIds = new Set()

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function loadProduct() {
      setLoading(true)
      setError('')

      try {
        const item = await getProductById(id)

        if (!isMounted) {
          return
        }

        if (!item) {
          setError('Product not found.')
          return
        }

        setProduct(item)

        if (!viewedProductIds.has(id)) {
          viewedProductIds.add(id)
          incrementProductView(id).catch((viewError) => {
            console.error('Unable to increment product view:', viewError)
            viewedProductIds.delete(id)
          })
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load product.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  const whatsappUrl = useMemo(() => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.trim()
    const message = product
      ? `Hello DSCENT.NG, I want to order ${product.name}.`
      : 'Hello DSCENT.NG, I want to order a fragrance.'

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }, [product])

  const { handleAddToCart, wasAdded } = useAddToCartFeedback(product || {})

  const productImages = product
    ? product.images?.length
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : []
    : []

  function getActiveImage() {
    return productImages[activeImageIndex] || product.imageUrl || null
  }

  // Reset active index when product changes
  useEffect(() => {
    setActiveImageIndex(0)
  }, [id])

  if (loading) {
    return (
      <section className="page-section page-fill product-detail-page">
        <p className="muted">Loading product...</p>
      </section>
    )
  }

  if (error || !product) {
    return (
      <section className="page-section page-fill product-detail-page">
        <div className="empty-state">
          <h1>Product unavailable</h1>
          <p>{error || 'This product could not be found.'}</p>
          <Link className="button secondary" to="/products">
            Back to Products
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page-section page-fill product-detail-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <div className="product-detail">
        <div className="product-detail-image-section">
          <div className="product-detail-image">
            {getActiveImage() ? <img alt={product.name} src={getActiveImage()} /> : <Sparkles size={42} />}
            {product.topPick && <span className="top-pick-badge">Top Pick</span>}
          </div>
          {productImages.length > 1 && (
            <div className="product-thumbnail-strip">
              {productImages.map((url, index) => (
                <button
                  className={`product-thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                  key={index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img alt={`${product.name} thumbnail ${index + 1}`} src={url} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-detail-copy">
          <span className="eyebrow">{product.category || 'DSCENT.NG fragrance'}</span>
          <h1>{product.name}</h1>
          <div className="price-row">
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice && <span>{formatPrice(product.oldPrice)}</span>}
          </div>
          <RatingDisplay rating={product.rating} reviewCount={product.reviewCount} />
          <div className="detail-grid">
            <span>{product.category || 'Fragrance'}</span>
            <span>{product.gender || 'Unisex'}</span>
            <span>{product.scentType || 'Signature scent'}</span>
            <span>{product.longevity || 'Long-lasting'}</span>
            <span>{product.inStock === false ? 'Out of stock' : 'In stock'}</span>
            {product.size && <span>{product.size}</span>}
            {product.occasion && <span>{product.occasion}</span>}
          </div>
          <div className="product-detail-actions">
            <button className="button secondary" type="button" onClick={handleAddToCart}>
              <ShoppingBag size={18} />
              {wasAdded ? 'Added' : 'Add to Cart'}
            </button>
            <a className="button primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} />
              Order on WhatsApp
            </a>
            <Link className="button secondary" to="/products">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
      <div className="product-description-card">
        <span className="eyebrow">Description</span>
        <p>{product.description || 'A carefully selected DSCENT.NG fragrance.'}</p>
      </div>
    </section>
  )
}
