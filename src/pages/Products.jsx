import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { getProducts } from '../services/productService.js'

const filterOptions = {
  category: ['Perfume Oil', 'Body Spray', 'Designer Perfume', 'Unisex Perfume', 'Gift Set', 'Perfume', 'Combo Package', 'Roll On'],
  gender: ['Male', 'Female', 'Unisex'],
  scentType: ['Sweet', 'Fresh', 'Floral', 'Woody', 'Spicy', 'Oud', 'Citrus', 'Vanilla'],
  inStock: ['In Stock', 'Out of Stock'],
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    scentType: '',
    inStock: '',
  })

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

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch = product.name?.toLowerCase().includes(normalizedSearch)
      const matchesCategory = !filters.category || product.category === filters.category
      const matchesGender = !filters.gender || product.gender === filters.gender
      const matchesScentType = !filters.scentType || product.scentType === filters.scentType
      const matchesStock =
        !filters.inStock ||
        (filters.inStock === 'In Stock' ? product.inStock !== false : product.inStock === false)

      return matchesSearch && matchesCategory && matchesGender && matchesScentType && matchesStock
    })
  }, [filters, products, searchTerm])

  function updateFilter(event) {
    const { name, value } = event.target
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  return (
    <section className="page-section page-fill">
      <div className="section-heading">
        <span className="eyebrow">Products</span>
        <h1>DSCENT.NG collection</h1>
        <p>Browse real fragrances from the DSCENT.NG inventory.</p>
      </div>

      <div className="products-content">
        <div className="product-controls">
          <label className="search-bar">
            <Search size={18} />
            <input
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by product name"
              type="search"
              value={searchTerm}
            />
          </label>
          <div className="filter-grid">
            {Object.entries(filterOptions).map(([filterName, options]) => (
              <label key={filterName}>
                <span>{filterName === 'scentType' ? 'Scent Type' : filterName}</span>
                <select name={filterName} value={filters[filterName]} onChange={updateFilter}>
                  <option value="">All</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
        {loading ? (
          <p className="muted">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try a different search or filter, or check back after new products are added.</p>
          </div>
        ) : (
          <div className="product-grid products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
