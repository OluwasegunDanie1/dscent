import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductForm, { emptyProduct } from '../components/ProductForm.jsx'
import { createProduct } from '../services/productService.js'

export default function AddProduct() {
  const [formData, setFormData] = useState(emptyProduct)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await createProduct(formData)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Unable to create product.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-section page-fill">
      <span className="eyebrow">Admin products</span>
      <h1>Add DSCENT.NG product</h1>
      {error && <p className="form-error">{error}</p>}
      <ProductForm
        formData={formData}
        isSubmitting={isSubmitting}
        submitLabel="Save Product"
        onCancel={() => navigate('/admin')}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
