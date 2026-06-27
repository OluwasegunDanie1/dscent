import ImageUploadButton from './ImageUploadButton.jsx'

const emptyProduct = {
  name: '',
  price: '',
  oldPrice: '',
  category: '',
  scentType: '',
  gender: '',
  size: '',
  longevity: '',
  occasion: '',
  description: '',
  imageUrl: '',
  images: [],
  topPick: false,
  inStock: true,
  rating: 5,
  reviewCount: 0,
}

const selectFields = [
  {
    name: 'category',
    label: 'Category',
    options: ['Perfume Oil', 'Body Spray', 'Designer Perfume', 'Unisex Perfume', 'Gift Set', 'Ordinary Perfume', 'Combo Package', 'Roll On'],
  },
  {
    name: 'gender',
    label: 'Gender',
    options: ['Male', 'Female', 'Unisex'],
  },
  {
    name: 'scentType',
    label: 'Scent type',
    options: ['Sweet', 'Fresh', 'Floral', 'Woody', 'Spicy', 'Oud', 'Citrus', 'Vanilla'],
  },
  {
    name: 'longevity',
    label: 'Longevity',
    options: ['Mild', 'Moderate', 'Long-lasting'],
  },
  {
    name: 'occasion',
    label: 'Occasion',
    options: ['Everyday', 'Office', 'Date Night', 'Gift', 'Luxury', 'Evening'],
  },
]

export { emptyProduct }

export default function ProductForm({
  formData,
  isSubmitting,
  onCancel,
  onChange,
  onSubmit,
  submitLabel,
}) {
  function updateField(event) {
    const { checked, name, type, value } = event.target
    onChange({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  function updateImages(images) {
    onChange({
      ...formData,
      images,
      imageUrl: images[0] || '',
    })
  }

  return (
    <form className="admin-form product-form" onSubmit={onSubmit}>
      <div className="form-section">
        <h2>Product Details</h2>
        <div className="form-grid">
          <label>
            Product name
            <input
              name="name"
              onChange={updateField}
              placeholder="Amber Oud Intense"
              required
              value={formData.name ?? ''}
            />
          </label>
          <label>
            Size
            <input
              name="size"
              onChange={updateField}
              placeholder="50ml"
              value={formData.size ?? ''}
            />
          </label>
          {selectFields.map((field) => (
            <label key={field.name}>
              {field.label}
              <select name={field.name} onChange={updateField} value={formData[field.name] ?? ''}>
                <option value="">Select {field.label.toLowerCase()}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h2>Pricing & Availability</h2>
        <div className="form-grid">
          <label>
            Price
            <input
              name="price"
              onChange={updateField}
              placeholder="25000"
              required
              type="number"
              value={formData.price ?? ''}
            />
          </label>
          <label>
            Old price
            <input
              name="oldPrice"
              onChange={updateField}
              placeholder="30000"
              type="number"
              value={formData.oldPrice ?? ''}
            />
          </label>
          <label>
            Rating
            <input
              max="5"
              min="0"
              name="rating"
              onChange={updateField}
              step="0.1"
              type="number"
              value={formData.rating ?? 5}
            />
          </label>
          <label>
            Review count
            <input
              min="0"
              name="reviewCount"
              onChange={updateField}
              type="number"
              value={formData.reviewCount ?? 0}
            />
          </label>
        </div>
        <div className="checkbox-row">
          <label>
            <input
              checked={Boolean(formData.topPick)}
              name="topPick"
              onChange={updateField}
              type="checkbox"
            />
            Top Pick
          </label>
          <label>
            <input
              checked={Boolean(formData.inStock)}
              name="inStock"
              onChange={updateField}
              type="checkbox"
            />
            In Stock
          </label>
        </div>
      </div>

      <div className="form-section">
        <h2>Image & Description</h2>
        <ImageUploadButton images={formData.images || []} onImagesChange={updateImages} />
        <label>
          Description
          <textarea
            name="description"
            onChange={updateField}
            placeholder="Describe notes, feel, and ideal wearer."
            rows="5"
            value={formData.description ?? ''}
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="button primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        <button className="button secondary" disabled={isSubmitting} type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
