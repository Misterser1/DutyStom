import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { categoryIcons } from '../CategoryIcons/CategoryIcons'
import './CategoryBar.css'

function CategoryBar() {
  const location = useLocation()
  const [categories, setCategories] = useState([])
  const [subcategoriesMap, setSubcategoriesMap] = useState({})
  const [brandsMap, setBrandsMap] = useState({})
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    // Загружаем основные категории
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCategories(data)
        }
      })
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  // Загружаем подкатегории и бренды для категории при наведении
  const handleMouseEnter = async (category) => {
    setActiveDropdown(category.id)

    // Если уже загружали данные для этой категории, не загружаем снова
    if (subcategoriesMap[category.slug] && brandsMap[category.slug]) {
      return
    }

    try {
      // Загружаем подкатегории и товары параллельно
      const [subcategoriesRes, productsRes] = await Promise.all([
        fetch(`/api/categories/${category.slug}/subcategories`),
        fetch(`/api/products?category=${category.slug}`)
      ])

      if (subcategoriesRes.ok) {
        const subcategories = await subcategoriesRes.json()
        setSubcategoriesMap(prev => ({
          ...prev,
          [category.slug]: subcategories
        }))
      }

      // Извлекаем уникальные бренды из товаров
      if (productsRes.ok) {
        const products = await productsRes.json()
        const brandCounts = {}
        products.forEach(p => {
          if (p.brand) {
            brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1
          }
        })
        const brands = Object.entries(brandCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count) // Сортируем по количеству товаров
          .slice(0, 8) // Берём топ-8 брендов

        setBrandsMap(prev => ({
          ...prev,
          [category.slug]: brands
        }))
      }
    } catch (err) {
      console.error('Error fetching category data:', err)
    }
  }

  return (
    <nav className="category-bar">
      <div className="category-bar-content">
        {categories.map(category => {
          const isActive = location.pathname === `/category/${category.slug}`
          const IconComponent = categoryIcons[category.slug]
          const subcategories = subcategoriesMap[category.slug] || []
          const brands = brandsMap[category.slug] || []
          const hasDropdown = subcategories.length > 0 || brands.length > 0
          const isDropdownOpen = activeDropdown === category.id

          return (
            <div
              key={category.id}
              className={`category-item-wrapper ${isDropdownOpen ? 'dropdown-open' : ''}`}
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={`/category/${category.slug}`}
                className={`category-item ${isActive ? 'active' : ''}`}
              >
                <span className="category-icon">
                  {IconComponent ? (
                    <IconComponent />
                  ) : (
                    <span className="icon-placeholder">📦</span>
                  )}
                </span>
                <span className="category-name">{category.name}</span>
              </Link>

              {/* Dropdown с подкатегориями и брендами */}
              {hasDropdown && isDropdownOpen && (
                <div className="mega-dropdown">
                  <div className="mega-dropdown-content">
                    {/* Секция подкатегорий */}
                    {subcategories.length > 0 && (
                      <div className="dropdown-section">
                        <div className="section-title">Subcategories</div>
                        <div className="section-items">
                          {subcategories.map(sub => (
                            <Link
                              key={sub.id}
                              to={`/category/${category.slug}`}
                              className="dropdown-item"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {sub.name}
                              <span className="item-count">({sub.product_count})</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Секция брендов */}
                    {brands.length > 0 && (
                      <div className="dropdown-section">
                        <div className="section-title">Popular Brands</div>
                        <div className="section-items brands-grid">
                          {brands.map(brand => (
                            <Link
                              key={brand.name}
                              to={`/category/${category.slug}`}
                              className="dropdown-item brand-item"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {brand.name}
                              <span className="item-count">({brand.count})</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
