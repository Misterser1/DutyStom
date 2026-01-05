import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard/ProductCard'
import './CategoryPage.css'

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      setLoading(true)
      fetch(`/api/products?search=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setProducts(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error searching products:', err)
          setLoading(false)
        })
    } else {
      setProducts([])
      setLoading(false)
    }
  }, [query])

  if (loading) {
    return (
      <div className="category-page">
        <div className="category-header">
          <h1>Поиск: "{query}"</h1>
        </div>
        <div className="loading">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>Поиск: "{query}"</h1>
        <p className="results-count">Найдено: {products.length} товаров</p>
      </div>

      {products.length === 0 ? (
        <div className="no-results">
          <p>По вашему запросу ничего не найдено</p>
          <p>Попробуйте изменить запрос или <Link to="/">вернуться на главную</Link></p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage
