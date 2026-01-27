import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { categoryIcons } from '../CategoryIcons/CategoryIcons'
import { useLanguage } from '../../contexts/LanguageContext'
import './CategoryBar.css'

// Порядок отображения категорий
const CATEGORY_ORDER = [
  'implantaty',
  'protetika',
  'instrumenty',
  'hirurgicheskie-nabory',
  'kostnye-materialy',
  'membrany',
  'piny-i-gbr',
  'rashodniki',
  'prochee'
]

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

function CategoryBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { language, t, getLocalized } = useLanguage()
  const [categories, setCategories] = useState([])
  const [brandsMap, setBrandsMap] = useState({})
  const [categoryProducts, setCategoryProducts] = useState({}) // Товары по брендам для мега-меню
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState('center')
  const dropdownRef = useRef(null)
  const wrapperRefs = useRef({})

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Сортируем по заданному порядку
          const sortedData = [...data].sort((a, b) => {
            const indexA = CATEGORY_ORDER.indexOf(a.slug)
            const indexB = CATEGORY_ORDER.indexOf(b.slug)
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
          })
          setCategories(sortedData)
        }
      })
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Вычисляем позицию dropdown
  const calculateDropdownPosition = (categoryId) => {
    const wrapper = wrapperRefs.current[categoryId]
    if (!wrapper) return 'center'

    const rect = wrapper.getBoundingClientRect()
    const viewportWidth = window.innerWidth

    // Если элемент слишком близко к левому краю
    if (rect.left < 150) {
      return 'left'
    }
    // Если элемент слишком близко к правому краю
    if (viewportWidth - rect.right < 150) {
      return 'right'
    }
    return 'center'
  }

  // Загружаем бренды для категории
  const loadBrands = async (category) => {
    if (brandsMap[category.slug]) return

    try {
      const res = await fetch(`/api/products?category=${category.slug}`)
      if (res.ok) {
        const products = await res.json()
        const brandCounts = {}
        products.forEach(p => {
          if (p.brand) {
            brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1
          }
        })
        const brands = Object.entries(brandCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 20)

        setBrandsMap(prev => ({
          ...prev,
          [category.slug]: brands
        }))

        // Для имплантов и протетики загружаем также товары по брендам
        if (category.slug === 'implantaty' || category.slug === 'protetika') {
          const productsByBrand = {}
          products.forEach(p => {
            if (p.brand) {
              if (!productsByBrand[p.brand]) {
                productsByBrand[p.brand] = []
              }
              productsByBrand[p.brand].push(p)
            }
          })
          setCategoryProducts(prev => ({
            ...prev,
            [category.slug]: productsByBrand
          }))
        }
      }
    } catch (err) {
      console.error('Error fetching brands:', err)
    }
  }

  // Обработка клика на категорию
  const handleCategoryClick = (e, category) => {
    e.preventDefault()

    // Если уже открыто это меню - переходим на страницу категории
    if (activeDropdown === category.id) {
      setActiveDropdown(null)
      navigate(`/category/${category.slug}`)
      return
    }

    // Открываем меню
    const position = calculateDropdownPosition(category.id)
    setDropdownPosition(position)
    setActiveDropdown(category.id)
    loadBrands(category)
  }

  // Клик по бренду
  const handleBrandClick = (categorySlug, brandName) => {
    setActiveDropdown(null)
    navigate(`/category/${categorySlug}?brand=${encodeURIComponent(brandName)}`)
  }

  return (
    <nav className="category-bar">
      <div className="category-bar-content">
        {categories.map(category => {
          const IconComponent = categoryIcons[category.slug]
          const brands = brandsMap[category.slug] || []
          const isDropdownOpen = activeDropdown === category.id

          return (
            <div
              key={category.id}
              className={`category-item-wrapper ${isDropdownOpen ? 'dropdown-open' : ''}`}
              ref={el => {
                wrapperRefs.current[category.id] = el
                if (isDropdownOpen) dropdownRef.current = el
              }}
            >
              <div
                className="category-item"
                onClick={(e) => handleCategoryClick(e, category)}
              >
                <span className="category-icon">
                  <img
                    src={`/images/category-icons/${category.slug}.svg`}
                    alt={category.name}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'block'
                    }}
                  />
                  <span className="icon-fallback" style={{display: 'none'}}>
                    {IconComponent ? <IconComponent /> : '📦'}
                  </span>
                </span>
                <span className="category-name">{language === 'en' ? (CATEGORY_TRANSLATIONS_EN[category.slug] || category.name) : category.name}</span>
              </div>

              {/* Мега-меню: fullwidth для имплантов и протетики с hover-подменю */}
              {isDropdownOpen && (category.slug === 'implantaty' || category.slug === 'protetika') ? (
                <div className="mega-dropdown fullwidth implants-mega">
                  {brands.length > 0 ? (
                    <div className="implants-brands-row">
                      {brands.map(brand => {
                        const brandProducts = (categoryProducts[category.slug] || {})[brand.name] || []
                        return (
                          <div key={brand.name} className="implant-brand-wrapper">
                            <div
                              className="implant-brand-chip"
                              onClick={() => handleBrandClick(category.slug, brand.name)}
                            >
                              <span className="chip-name">{brand.name}</span>
                              <span className="chip-count">{brand.count}</span>
                            </div>
                            {/* Подменю при hover */}
                            <div className="implant-hover-submenu">
                              <div className={`submenu-columns ${brandProducts.length > 7 ? 'two-columns' : ''}`}>
                                <ul className="submenu-products">
                                  {brandProducts.slice(0, 7).map(product => (
                                    <li
                                      key={product.id}
                                      className="submenu-product-item"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setActiveDropdown(null)
                                        navigate(`/category/${category.slug}?brand=${encodeURIComponent(brand.name)}`)
                                      }}
                                    >
                                      {/* Название товара */}
                                      {(product.name_en || product.name).replace(/^(Implant|Имплант|Имплантат)\s*/i, '')}
                                    </li>
                                  ))}
                                </ul>
                                {brandProducts.length > 7 && (
                                  <ul className="submenu-products">
                                    {brandProducts.slice(7, 14).map(product => (
                                      <li
                                        key={product.id}
                                        className="submenu-product-item"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setActiveDropdown(null)
                                          navigate(`/category/${category.slug}?brand=${encodeURIComponent(brand.name)}`)
                                        }}
                                      >
                                        {/* Название всегда на английском */}
                                        {(product.name_en || product.name).replace(/^(Implant|Имплант|Имплантат)\s*/i, '')}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <button
                                className="submenu-all-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleBrandClick(category.slug, brand.name)
                                }}
                              >
                                {language === 'en' ? 'All products' : 'Все товары'} {brand.name}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="dropdown-loading">{t('common.loading')}</div>
                  )}
                </div>
              ) : isDropdownOpen && (
                <div className={`mega-dropdown compact position-${dropdownPosition}`}>
                  {brands.length > 0 ? (
                    <div className="brands-list">
                      {brands.map(brand => (
                        <div
                          key={brand.name}
                          className="brand-chip"
                          onClick={() => handleBrandClick(category.slug, brand.name)}
                        >
                          {brand.name}
                          <span className="brand-count">{brand.count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="dropdown-loading">{t('common.loading')}</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

export default CategoryBar
