import { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export function useAddToCartFeedback(product) {
  const { addToCart, cartItems } = useCart()
  const { showToast } = useToast()
  const [wasAdded, setWasAdded] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current)
    },
    [],
  )

  function handleAddToCart() {
    const isQuantityUpdate = cartItems.some((item) => item.id === product.id)

    addToCart(product)
    showToast(isQuantityUpdate ? 'Quantity updated in cart' : 'Added to cart')

    window.clearTimeout(timeoutRef.current)
    setWasAdded(true)
    timeoutRef.current = window.setTimeout(() => {
      setWasAdded(false)
    }, 1500)
  }

  return { handleAddToCart, wasAdded }
}
