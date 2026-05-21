export default function RatingDisplay({ rating = 0, reviewCount = 0 }) {
  const numericRating = Math.max(0, Math.min(5, Number(rating) || 0))
  const numericReviewCount = Number(reviewCount) || 0
  const roundedRating = numericRating.toFixed(1)

  return (
    <div className="rating-display" aria-label={`${roundedRating} out of 5 rating`}>
      <span className="rating-stars" aria-hidden="true">
        <span>★★★★★</span>
        <span style={{ width: `${(numericRating / 5) * 100}%` }}>★★★★★</span>
      </span>
      <span>
        {numericReviewCount > 0
          ? `${roundedRating} (${numericReviewCount} reviews)`
          : 'No reviews yet'}
      </span>
    </div>
  )
}
