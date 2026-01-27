import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import { useLanguage } from '../contexts/LanguageContext'
import './CategoryPage.css'

// Курс конвертации (настраивается)
const USD_RATE = 100 // 100 рублей = 1 доллар

// Переводы категорий на английский (по slug)
const CATEGORY_TRANSLATIONS_EN = {
  'implantaty': 'Implants',
  'protetika': 'Prosthetics',
  'instrumenty': 'Instruments',
  'hirurgicheskie-nabory': 'Surgical Kits',
  'kostnye-materialy': 'Bone Materials',
  'membrany': 'Membranes',
  'piny-i-gbr': 'Pins & GBR',
  'rashodniki': 'Consumables',
  'prochee': 'Other'
}

function CategoryPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { language, t, getLocalized } = useLanguage()
  const [allProducts, setAllProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  // Фильтры
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedSubcategories, setSelectedSubcategories] = useState([])
  const [subcategoryOptions, setSubcategoryOptions] = useState([])
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
      setSelectedSubcategories([])
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

          // Извлекаем уникальные подкатегории с количеством (для родительских категорий)
          const subcategoryCounts = {}
          productsData.forEach(p => {
            if (p.category_name) {
              subcategoryCounts[p.category_name] = (subcategoryCounts[p.category_name] || 0) + 1
            }
          })
          const uniqueSubcategories = Object.entries(subcategoryCounts)
            .map(([name, count]) => ({ name, count }))
            .filter(s => s.count > 0)
            .sort((a, b) => a.name.localeCompare(b.name))
          setSubcategoryOptions(uniqueSubcategories)
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

    // Фильтр по подкатегориям (множественный выбор)
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(p => selectedSubcategories.includes(p.category_name))
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
  }, [allProducts, selectedBrands, selectedSubcategories, priceRange, inStockOnly, sortBy])

  // Пагинация
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, currentPage, itemsPerPage])

  // Обновляем счётчики брендов на основе текущих фильтров (без учёта бренд-фильтра)
  const brandCountsFiltered = useMemo(() => {
    let filtered = [...allProducts]
    // Учитываем выбранные подкатегории
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(p => selectedSubcategories.includes(p.category_name))
    }
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
  }, [allProducts, selectedSubcategories, priceRange, inStockOnly])

  // Обновляем счётчики подкатегорий на основе текущих фильтров (без учёта подкатегория-фильтра)
  const subcategoryCountsFiltered = useMemo(() => {
    let filtered = [...allProducts]
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand))
    }
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
      if (p.category_name) {
        counts[p.category_name] = (counts[p.category_name] || 0) + 1
      }
    })
    return counts
  }, [allProducts, selectedBrands, priceRange, inStockOnly])

  // Обработчики
  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
    setCurrentPage(1)
  }

  const handleSubcategoryToggle = (subcategory) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    )
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedBrands([])
    setSelectedSubcategories([])
    setPriceRange({ min: '', max: '' })
    setInStockOnly(false)
    setSortBy('default')
    setCurrentPage(1)
  }

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>
  }

  const categoryDescriptions = {
    ru: {
      implants: 'Широкий ассортимент дентальных имплантатов ведущих мировых производителей: DIO, MEGAGEN, STRAUMANN, OSSTEM и других. Все системы сертифицированы и подходят для различных клинических случаев.',
      components: 'Протетические компоненты, абатменты, формирователи десны, аналоги и трансферы для всех популярных имплантационных систем.',
      bone: 'Костнозамещающие материалы: ксенографты, аллографты, синтетические материалы для костной пластики и аугментации.',
      membrane: 'Резорбируемые и нерезорбируемые мембраны для направленной костной и тканевой регенерации.',
      supplies: 'Расходные материалы: шовный материал, цементы, адгезивы, ирригационные системы.'
    },
    en: {
      implants: 'Wide range of dental implants from leading global manufacturers: DIO, MEGAGEN, STRAUMANN, OSSTEM and others. All systems are certified and suitable for various clinical cases.',
      components: 'Prosthetic components, abutments, healing caps, analogs and transfers for all popular implant systems.',
      bone: 'Bone substitutes: xenografts, allografts, synthetic materials for bone grafting and augmentation.',
      membrane: 'Resorbable and non-resorbable membranes for guided bone and tissue regeneration.',
      supplies: 'Consumables: suture material, cements, adhesives, irrigation systems.'
    }
  }

  const getCategoryDescription = (slug) => {
    return categoryDescriptions[language]?.[slug] || categoryDescriptions.ru[slug] || ''
  }

  return (
    <div className="category-page">
      {/* Хлебные крошки */}
      <nav className="breadcrumbs">
        <Link to="/">{language === 'en' ? 'Home' : 'Главная'}</Link>
        <span className="breadcrumb-separator">→</span>
        <Link to="/catalog">{t('nav.catalog')}</Link>
        <span className="breadcrumb-separator">→</span>
        <span className="breadcrumb-current">{(language === 'en' && category?.slug) ? (CATEGORY_TRANSLATIONS_EN[category.slug] || category?.name) : (category?.name || (language === 'en' ? 'Products' : 'Товары'))}</span>
      </nav>

      {/* Заголовок и описание */}
      <header className="category-header">
        <h1 className="category-title">{(language === 'en' && category?.slug) ? (CATEGORY_TRANSLATIONS_EN[category.slug] || category?.name) : (category?.name || (language === 'en' ? 'Products' : 'Товары'))}</h1>
        {getCategoryDescription(slug) && (
          <p className="category-description">{getCategoryDescription(slug)}</p>
        )}
      </header>

      <div className="category-content">
        {/* Боковая панель фильтров (десктоп) / Выдвижная панель (мобиль) */}
        <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
          <div className="filters-header">
            <h3>{t('filters.title')}</h3>
            <button className="close-filters" onClick={() => setShowFilters(false)}>×</button>
          </div>

          {/* Фильтр по брендам */}
          {brands.length > 0 && (
            <div className="filter-section">
              <h4 className="filter-title">{t('filters.brand')}</h4>
              <div className="brand-checkboxes">
                {brands.filter(brand => (brandCountsFiltered[brand.name] || 0) > 0).map(brand => (
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

          {/* Фильтр по подкатегориям */}
          {subcategoryOptions.length > 1 && (
            <div className="filter-section">
              <h4 className="filter-title">{language === 'en' ? 'Subcategory' : 'Подкатегория'}</h4>
              <div className="brand-checkboxes">
                {subcategoryOptions.filter(sub => (subcategoryCountsFiltered[sub.name] || 0) > 0).map(sub => (
                  <label key={sub.name} className="brand-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(sub.name)}
                      onChange={() => handleSubcategoryToggle(sub.name)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="brand-name">{sub.name}</span>
                    <span className="brand-count">({subcategoryCountsFiltered[sub.name] || 0})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Фильтр по цене */}
          <div className="filter-section">
            <h4 className="filter-title">{t('filters.price')}</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder={t('filters.from')}
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
                placeholder={t('filters.to')}
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
              <span>{t('filters.inStock')}</span>
            </label>
          </div>

          {/* Кнопка сброса */}
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            {t('filters.reset')}
          </button>
        </aside>

        {/* Основной контент */}
        <main className="products-main">
          {/* Панель управления */}
          <div className="products-toolbar">
            <div className="results-count">
              {t('pagination.showing')} {paginatedProducts.length} {t('pagination.of')} {filteredProducts.length} {t('pagination.products')}
            </div>

            <div className="toolbar-actions">
              {/* Кнопка фильтров на мобиле */}
              <button className="show-filters-btn" onClick={() => setShowFilters(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
                {t('filters.title')}
                {(selectedBrands.length + selectedSubcategories.length) > 0 && (
                  <span className="filter-badge">{selectedBrands.length + selectedSubcategories.length}</span>
                )}
              </button>

              {/* Сортировка */}
              <div className="sort-control">
                <label htmlFor="sort">{t('sort.title')}:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="default">{t('sort.default')}</option>
                  <option value="price-asc">{t('sort.priceAsc')}</option>
                  <option value="price-desc">{t('sort.priceDesc')}</option>
                  <option value="brand-az">{language === 'en' ? 'Brand: A–Z' : 'Бренд: A–Z'}</option>
                  <option value="name-az">{t('sort.nameAsc')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Активные фильтры */}
          {(selectedBrands.length > 0 || selectedSubcategories.length > 0 || priceRange.min || priceRange.max || inStockOnly) && (
            <div className="active-filters">
              {selectedBrands.map(brand => (
                <span key={brand} className="filter-tag">
                  {brand}
                  <button onClick={() => handleBrandToggle(brand)}>×</button>
                </span>
              ))}
              {selectedSubcategories.map(sub => (
                <span key={sub} className="filter-tag">
                  {sub}
                  <button onClick={() => handleSubcategoryToggle(sub)}>×</button>
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
                  {t('filters.inStock')}
                  <button onClick={() => setInStockOnly(false)}>×</button>
                </span>
              )}
              <button className="clear-all-btn" onClick={handleClearFilters}>
                {t('filters.resetAll')}
              </button>
            </div>
          )}

          {/* Сетка товаров */}
          {paginatedProducts.length > 0 ? (
            <ProductGrid products={paginatedProducts} showUSD={true} />
          ) : (
            <div className="no-products">
              <p>{t('search.noResults')}</p>
              <button onClick={handleClearFilters}>{t('filters.reset')}</button>
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
