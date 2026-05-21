import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm, { emptyProduct } from '../components/ProductForm.jsx'
import { getProductById, updateProduct } from '../services/productService.js'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(emptyProduct)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadProduct() {
      setLoading(true)
      setError('')

      try {
        const product = await getProductById(id)

        if (!isMounted) {
          return
        }

        if (!product) {
          setError('Product not found.')
          return
        }

        setFormData({
          ...emptyProduct,
          ...product,
          price: product.price ?? '',
          oldPrice: product.oldPrice ?? '',
          rating: product.rating ?? 5,
          reviewCount: Number(product.reviewCount) || 0,
          topPick: Boolean(product.topPick),
          inStock: product.inStock ?? true,
        })
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

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await updateProduct(id, formData)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Unable to update product.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-section page-fill">
      <span className="eyebrow">Admin products</span>
      <h1>Edit DSCENT.NG product</h1>
      <p className="muted">Update Firestore details for this product.</p>
      {error && <p className="form-error">{error}</p>}
      {loading ? (
        <p className="muted">Loading product...</p>
      ) : (
        <ProductForm
          formData={formData}
          isSubmitting={isSubmitting}
          submitLabel="Update Product"
          onCancel={() => navigate('/admin')}
          onChange={setFormData}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}
