const nairaFormatter = new Intl.NumberFormat('en-NG', {
  currency: 'NGN',
  maximumFractionDigits: 0,
  style: 'currency',
})

export function formatPrice(price) {
  if (!price) {
    return 'Ask for price'
  }

  const numericPrice = getNumericPrice(price)

  if (Number.isNaN(numericPrice)) {
    return price
  }

  return nairaFormatter.format(numericPrice)
}

export function getNumericPrice(price) {
  if (!price) {
    return 0
  }

  return typeof price === 'number' ? price : Number(String(price).replace(/[^\d.]/g, ''))
}
