import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard/ProductCard'
import { useLanguage } from '../contexts/LanguageContext'
import './CategoryPage.css'

const ITEMS_PER_PAGE = 12

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const pageParam = parseInt(searchParams.get('page')) || 1
  const { language, t } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(pageParam)

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
    // Сбрасываем страницу при новом поиске
    setCurrentPage(1)
  }, [query])

  // Синхронизация страницы с URL
  useEffect(() => {
    setCurrentPage(pageParam)
  }, [pageParam])

  // Расчёт пагинации
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return products.slice(start, start + ITEMS_PER_PAGE)
  }, [products, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSearchParams({ q: query, page: page.toString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Генерация номеров страниц для отображения
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

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
        <p className="results-count">
          {language === 'en' ? 'Found' : 'Найдено'}: {products.length} {t('pagination.products')}
          {totalPages > 1 && (
            <span> | {language === 'en' ? 'Page' : 'Страница'} {currentPage} {language === 'en' ? 'of' : 'из'} {totalPages}</span>
          )}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="no-results">
          <p>{t('search.noResults')}</p>
          <p>{language === 'en' ? 'Try changing your query or' : 'Попробуйте изменить запрос или'} <Link to="/">{language === 'en' ? 'go to home' : 'вернуться на главную'}</Link></p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {language === 'en' ? '← Prev' : '← Назад'}
              </button>

              <div className="page-numbers">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {language === 'en' ? 'Next →' : 'Далее →'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SearchPage
