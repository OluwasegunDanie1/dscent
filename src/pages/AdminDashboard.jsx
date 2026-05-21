import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { deleteProduct, getProducts } from '../services/productService.js'

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState('')

  const totals = useMemo(
    () => ({
      products: products.length,
      views: products.reduce((sum, product) => sum + (Number(product.views) || 0), 0),
      whatsappClicks: products.reduce(
        (sum, product) => sum + (Number(product.whatsappClicks) || 0),
        0,
      ),
    }),
    [products],
  )

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      setLoading(true)
      setError('')

      try {
        const items = await getProducts()
        if (isMounted) {
          setProducts(items)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load products.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleDelete(product) {
    const shouldDelete = window.confirm(`Delete ${product.name}? This cannot be undone.`)

    if (!shouldDelete) {
      return
    }

    setDeletingId(product.id)
    setError('')

    try {
      await deleteProduct(product.id)
      setProducts((currentProducts) => currentProducts.filter((item) => item.id !== product.id))
    } catch (err) {
      setError(err.message || 'Unable to delete product.')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <section className="page-section page-fill">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>DSCENT.NG dashboard</h1>
        <p>Manage products, stock, and performance signals for the storefront.</p>
        <div className="admin-session">
          <span>{currentUser?.email}</span>
          <button className="button secondary" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Total products</span>
          <strong>{totals.products}</strong>
        </article>
        <article className="stat-card">
          <span>Total views</span>
          <strong>{totals.views}</strong>
        </article>
        <article className="stat-card">
          <span>WhatsApp clicks</span>
          <strong>{totals.whatsappClicks}</strong>
        </article>
      </div>

      <div className="admin-toolbar">
        <div>
          <span className="eyebrow">Products</span>
          <h2>Inventory</h2>
        </div>
        <Link className="button primary" to="/admin/products/new">
          Add Product
        </Link>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading ? (
        <p className="muted">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h2>No products yet</h2>
          <p>Add your first fragrance to start building the DSCENT.NG collection.</p>
          <Link className="button primary" to="/admin/products/new">
            Add Product
          </Link>
        </div>
      ) : (
        <div className="admin-product-list">
          {products.map((product) => (
            <article className="admin-product-card" key={product.id}>
              <div className="admin-product-image">
                {product.imageUrl ? <img alt={product.name} src={product.imageUrl} /> : <span>DS</span>}
              </div>
              <div className="admin-product-main">
                <div>
                  <p className="product-mood">{product.category || 'Perfume'}</p>
                  <h3>{product.name}</h3>
                  <p>{product.description || 'No description yet.'}</p>
                </div>
                <div className="admin-product-meta">
                  <span>{product.price || 'No price'}</span>
                  {product.oldPrice && <span>Old: {product.oldPrice}</span>}
                  <span>{product.inStock ? 'In stock' : 'Out of stock'}</span>
                  {product.topPick && <span>Top pick</span>}
                </div>
              </div>
              <div className="admin-product-actions">
                <Link className="button secondary" to={`/admin/products/${product.id}/edit`}>
                  Edit
                </Link>
                <button
                  className="button danger"
                  disabled={deletingId === product.id}
                  type="button"
                  onClick={() => handleDelete(product)}
                >
                  {deletingId === product.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
