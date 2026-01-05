import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import './CategoryPage.css'

// Курс конвертации (настраивается)
const USD_RATE = 100 // 100 рублей = 1 доллар

function CategoryPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [allProducts, setAllProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  // Фильтры
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState('default')

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

  // Мобильный фильтр
  const [showFilters, setShowFilters] = useState(false)

  // Читаем бренд из URL при загрузке
  useEffect(() => {
    const brandFromUrl = searchParams.get('brand')
    if (brandFromUrl) {
      setSelectedBrands([brandFromUrl])
    }
  }, [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Сохраняем бренд из URL если есть
      const brandFromUrl = searchParams.get('brand')
      if (!brandFromUrl) {
        setSelectedBrands([])
      }
      setPriceRange({ min: '', max: '' })
      setCurrentPage(1)

      try {
        const [categoryRes, subcategoriesRes, productsRes] = await Promise.all([
          fetch(`/api/categories/${slug}`),
          fetch(`/api/categories/${slug}/subcategories`),
          fetch(`/api/products?category=${slug}`)
        ])

        if (categoryRes.ok) {
          const categoryData = await categoryRes.json()
          setCategory(categoryData)
        }

        if (subcategoriesRes.ok) {
          const subcategoriesData = await subcategoriesRes.json()
          setSubcategories(subcategoriesData)
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json()
          // Добавляем конвертированные цены в USD
          const productsWithUSD = productsData.map(p => ({
            ...p,
            priceUSD: Math.round(p.price / USD_RATE),
            priceRUB: p.price
          }))
          setAllProducts(productsWithUSD)

          // Извлекаем уникальные бренды с количеством
          const brandCounts = {}
          productsData.forEach(p => {
            if (p.brand) {
              brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1
            }
          })
          const uniqueBrands = Object.entries(brandCounts)
            .map(([brand, count]) => ({ name: brand, count }))
            .filter(b => b.count > 0)
            .sort((a, b) => a.name.localeCompare(b.name))
          setBrands(uniqueBrands)
        }
      } catch (error) {
        console.error('Error fetching category data:', error)
      }

      setLoading(false)
    }

    fetchData()
  }, [slug])

  // Фильтрованные и отсортированные товары
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Фильтр по брендам (множественный выбор)
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand))
    }

    // Фильтр по цене в USD
    if (priceRange.min) {
      filtered = filtered.filter(p => p.priceUSD >= parseInt(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.priceUSD <= parseInt(priceRange.max))
    }

    // Фильтр по наличию
    if (inStockOnly) {
      filtered = filtered.filter(p => p.in_stock === 1)
    }

    // Сортировка
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.priceUSD - b.priceUSD)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.priceUSD - a.priceUSD)
        break
      case 'brand-az':
        filtered.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''))
        break
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // По умолчанию - по id
        break
    }

    return filtered
  }, [allProducts, selectedBrands, priceRange, inStockOnly, sortBy])

  // Пагинация
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, currentPage, itemsPerPage])

  // Обновляем счётчики брендов на основе текущих фильтров (без учёта бренд-фильтра)
  const brandCountsFiltered = useMemo(() => {
    let filtered = [...allProducts]
    if (priceRange.min) {
      filtered = filtered.filter(p => p.priceUSD >= parseInt(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.priceUSD <= parseInt(priceRange.max))
    }
    if (inStockOnly) {
      filtered = filtered.filter(p => p.in_stock === 1)
    }

    const counts = {}
    filtered.forEach(p => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1
      }
    })
    return counts
  }, [allProducts, priceRange, inStockOnly])

  // Обработчики
  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedBrands([])
    setPriceRange({ min: '', max: '' })
    setInStockOnly(false)
    setSortBy('default')
    setCurrentPage(1)
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  const categoryDescriptions = {
    implants: 'Широкий ассортимент дентальных имплантатов ведущих мировых производителей: DIO, MEGAGEN, STRAUMANN, OSSTEM и других. Все системы сертифицированы и подходят для различных клинических случаев.',
    components: 'Протетические компоненты, абатменты, формирователи десны, аналоги и трансферы для всех популярных имплантационных систем.',
    bone: 'Костнозамещающие материалы: ксенографты, аллографты, синтетические материалы для костной пластики и аугментации.',
    membrane: 'Резорбируемые и нерезорбируемые мембраны для направленной костной и тканевой регенерации.',
    supplies: 'Расходные материалы: шовный материал, цементы, адгезивы, ирригационные системы.'
  }

  return (
    <div className="category-page">
      {/* Хлебные крошки */}
      <nav className="breadcrumbs">
        <Link to="/">Главная</Link>
        <span className="breadcrumb-separator">→</span>
        <Link to="/catalog">Каталог</Link>
        <span className="breadcrumb-separator">→</span>
        <span className="breadcrumb-current">{category?.name || 'Товары'}</span>
      </nav>

      {/* Заголовок и описание */}
      <header className="category-header">
        <h1 className="category-title">{category?.name || 'Товары'}</h1>
        {categoryDescriptions[slug] && (
          <p className="category-description">{categoryDescriptions[slug]}</p>
        )}
      </header>

      <div className="category-content">
        {/* Боковая панель фильтров (десктоп) / Выдвижная панель (мобиль) */}
        <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
          <div className="filters-header">
            <h3>Фильтры</h3>
            <button className="close-filters" onClick={() => setShowFilters(false)}>×</button>
          </div>

          {/* Фильтр по брендам */}
          {brands.length > 0 && (
            <div className="filter-section">
              <h4 className="filter-title">Бренд</h4>
              <div className="brand-checkboxes">
                {brands.map(brand => (
                  <label key={brand.name} className="brand-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandToggle(brand.name)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="brand-name">{brand.name}</span>
                    <span className="brand-count">({brandCountsFiltered[brand.name] || 0})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Фильтр по цене */}
          <div className="filter-section">
            <h4 className="filter-title">Цена (USD)</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="От"
                value={priceRange.min}
                onChange={e => {
                  setPriceRange(prev => ({ ...prev, min: e.target.value }))
                  setCurrentPage(1)
                }}
                className="price-input"
              />
              <span className="price-separator">—</span>
              <input
                type="number"
                placeholder="До"
                value={priceRange.max}
                onChange={e => {
                  setPriceRange(prev => ({ ...prev, max: e.target.value }))
                  setCurrentPage(1)
                }}
                className="price-input"
              />
            </div>
          </div>

          {/* Фильтр по наличию */}
          <div className="filter-section">
            <label className="stock-checkbox">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => {
                  setInStockOnly(e.target.checked)
                  setCurrentPage(1)
                }}
              />
              <span className="checkbox-custom"></span>
              <span>Только в наличии</span>
            </label>
          </div>

          {/* Кнопка сброса */}
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Сбросить фильтры
          </button>
        </aside>

        {/* Основной контент */}
        <main className="products-main">
          {/* Панель управления */}
          <div className="products-toolbar">
            <div className="results-count">
              Показано {paginatedProducts.length} из {filteredProducts.length} товаров
            </div>

            <div className="toolbar-actions">
              {/* Кнопка фильтров на мобиле */}
              <button className="show-filters-btn" onClick={() => setShowFilters(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
                Фильтры
                {selectedBrands.length > 0 && (
                  <span className="filter-badge">{selectedBrands.length}</span>
                )}
              </button>

              {/* Сортировка */}
              <div className="sort-control">
                <label htmlFor="sort">Сортировка:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="default">По умолчанию</option>
                  <option value="price-asc">Цена: по возрастанию</option>
                  <option value="price-desc">Цена: по убыванию</option>
                  <option value="brand-az">Бренд: A–Z</option>
                  <option value="name-az">Название: A–Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Активные фильтры */}
          {(selectedBrands.length > 0 || priceRange.min || priceRange.max || inStockOnly) && (
            <div className="active-filters">
              {selectedBrands.map(brand => (
                <span key={brand} className="filter-tag">
                  {brand}
                  <button onClick={() => handleBrandToggle(brand)}>×</button>
                </span>
              ))}
              {(priceRange.min || priceRange.max) && (
                <span className="filter-tag">
                  ${priceRange.min || '0'} — ${priceRange.max || '∞'}
                  <button onClick={() => setPriceRange({ min: '', max: '' })}>×</button>
                </span>
              )}
              {inStockOnly && (
                <span className="filter-tag">
                  В наличии
                  <button onClick={() => setInStockOnly(false)}>×</button>
                </span>
              )}
              <button className="clear-all-btn" onClick={handleClearFilters}>
                Сбросить все
              </button>
            </div>
          )}

          {/* Сетка товаров */}
          {paginatedProducts.length > 0 ? (
            <ProductGrid products={paginatedProducts} showUSD={true} />
          ) : (
            <div className="no-products">
              <p>Товары не найдены</p>
              <button onClick={handleClearFilters}>Сбросить фильтры</button>
            </div>
          )}

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                «
              </button>
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                ‹
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 2
                  )
                  .map((page, idx, arr) => (
                    <span key={page}>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="page-ellipsis">...</span>
                      )}
                      <button
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </span>
                  ))}
              </div>

              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                ›
              </button>
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                »
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Overlay для мобильных фильтров */}
      {showFilters && (
        <div className="filters-overlay" onClick={() => setShowFilters(false)} />
      )}
    </div>
  )
}

export default CategoryPage
