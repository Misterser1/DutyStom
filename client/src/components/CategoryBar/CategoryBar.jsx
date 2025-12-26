import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { categoryIcons } from '../CategoryIcons/CategoryIcons'
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

function CategoryBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [brandsMap, setBrandsMap] = useState({})
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
          .sort((a, b) => b.count - a.count)
          .slice(0, 12)

        setBrandsMap(prev => ({
          ...prev,
          [category.slug]: brands
        }))
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
                <span className="category-name">{category.name}</span>
              </div>

              {/* Компактное меню с брендами */}
              {isDropdownOpen && (
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
                    <div className="dropdown-loading">Загрузка...</div>
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
