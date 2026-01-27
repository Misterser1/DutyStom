import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard/ProductCard'
import { useLanguage } from '../contexts/LanguageContext'
import './CategoryPage.css'

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { language, t } = useLanguage()
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
          <h1>{t('search.results')}: "{query}"</h1>
        </div>
        <div className="loading">{t('common.loading')}</div>
      </div>
    )
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{t('search.results')}: "{query}"</h1>
        <p className="results-count">{language === 'en' ? 'Found' : 'Найдено'}: {products.length} {t('pagination.products')}</p>
      </div>

      {products.length === 0 ? (
        <div className="no-results">
          <p>{t('search.noResults')}</p>
          <p>{language === 'en' ? 'Try changing your query or' : 'Попробуйте изменить запрос или'} <Link to="/">{language === 'en' ? 'go to home' : 'вернуться на главную'}</Link></p>
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
