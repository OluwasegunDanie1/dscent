import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { incrementWhatsappClick } from '../services/analyticsService.js'
import { formatPrice, getNumericPrice } from '../utils/formatPrice.js'

function buildWhatsAppMessage(cartItems, total) {
  const itemLines = cartItems
    .map((item, index) => {
      const subtotal = getNumericPrice(item.price) * item.quantity

      return `${index + 1}. ${item.name}
Qty: ${item.quantity}
Price: ${formatPrice(item.price)}
Subtotal: ${formatPrice(subtotal)}`
    })
    .join('\n\n')

  return `Hello DSCENT.NG, I want to order:

${itemLines}

Total: ${formatPrice(total)}

Please confirm availability.`
}

export default function Cart() {
  const [orderStatus, setOrderStatus] = useState('')
  const {
    cartItems,
    clearCart,
    decreaseQuantity,
    getCartTotal,
    increaseQuantity,
    removeFromCart,
  } = useCart()
  const total = getCartTotal()
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.trim() || '2348174832431'
  const whatsappMessage = buildWhatsAppMessage(cartItems, total)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  function handleSendOrder() {
    setOrderStatus('Order opened in WhatsApp. You can clear your cart after sending.')
    Promise.allSettled(cartItems.map((item) => incrementWhatsappClick(item.id)))
  }

  if (cartItems.length === 0) {
    return (
      <section className="page-section page-fill cart-page">
        <div className="empty-state cart-empty">
          <ShoppingBag size={34} />
          <h1>Your cart is empty</h1>
          <p>Choose your DSCENT.NG favourites and send one neat WhatsApp order.</p>
          <Link className="button primary" to="/products">
            Shop Collection
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page-section page-fill cart-page">
      <div className="section-heading">
        <span className="eyebrow">Your Selection</span>
        <h1>Cart</h1>
        <p>Review your fragrances, adjust quantities, then send the order to DSCENT.NG.</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => {
            const subtotal = getNumericPrice(item.price) * item.quantity

            return (
              <article className="cart-item" key={item.id}>
                <Link className="cart-item-image" to={`/products/${item.id}`}>
                  {item.imageUrl ? <img alt={item.name} src={item.imageUrl} /> : <ShoppingBag size={28} />}
                </Link>
                <div className="cart-item-main">
                  <span>{item.category || item.scentType || 'DSCENT.NG fragrance'}</span>
                  <h2>{item.name}</h2>
                  <strong>{formatPrice(item.price)}</strong>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls" aria-label={`Quantity for ${item.name}`}>
                    <button type="button" onClick={() => decreaseQuantity(item.id)}>
                      <Minus size={15} />
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => increaseQuantity(item.id)}>
                      <Plus size={15} />
                    </button>
                  </div>
                  <strong>{formatPrice(subtotal)}</strong>
                  <button
                    className="cart-remove-button"
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <aside className="cart-summary">
          <span className="eyebrow">Order Summary</span>
          <div>
            <span>Subtotal</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <a
            className="button primary"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
            onClick={handleSendOrder}
          >
            <MessageCircle size={18} />
            Send Order on WhatsApp
          </a>
          {orderStatus && <p className="cart-success-message">{orderStatus}</p>}
          <Link className="button secondary" to="/products">
            Continue Shopping
          </Link>
          <button className="button ghost" type="button" onClick={clearCart}>
            Clear Cart
          </button>
        </aside>
      </div>
    </section>
  )
}
