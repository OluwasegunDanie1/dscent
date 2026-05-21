import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getNumericPrice } from '../utils/formatPrice.js'

const CART_STORAGE_KEY = 'dscent-cart'
const CartContext = createContext(null)

function getStoredCart() {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    return storedCart ? JSON.parse(storedCart) : []
  } catch {
    return []
  }
}

function normalizeCartProduct(product) {
  return {
    id: product.id,
    category: product.category || '',
    imageUrl: product.imageUrl || '',
    name: product.name || 'DSCENT.NG fragrance',
    price: product.price || 0,
    scentType: product.scentType || '',
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getStoredCart)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const cartValue = useMemo(
    () => ({
      cartItems,
      addToCart(product) {
        const cartProduct = normalizeCartProduct(product)

        setCartItems((items) => {
          const existingItem = items.find((item) => item.id === cartProduct.id)

          if (existingItem) {
            return items.map((item) =>
              item.id === cartProduct.id ? { ...item, quantity: item.quantity + 1 } : item,
            )
          }

          return [...items, { ...cartProduct, quantity: 1 }]
        })
      },
      removeFromCart(productId) {
        setCartItems((items) => items.filter((item) => item.id !== productId))
      },
      increaseQuantity(productId) {
        setCartItems((items) =>
          items.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        )
      },
      decreaseQuantity(productId) {
        setCartItems((items) =>
          items
            .map((item) =>
              item.id === productId
                ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        )
      },
      clearCart() {
        setCartItems([])
      },
      getCartTotal() {
        return cartItems.reduce(
          (total, item) => total + getNumericPrice(item.price) * item.quantity,
          0,
        )
      },
      getCartCount() {
        return cartItems.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    [cartItems],
  )

  return <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
