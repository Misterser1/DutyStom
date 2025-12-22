import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { categoryIcons } from '../CategoryIcons/CategoryIcons'
import './CategoryBar.css'

// Данные категорий с подкатегориями
const mockCategories = [
  {
    id: 1,
    name: 'Имплантаты',
    slug: 'implants',
    subcategories: [
      { name: 'DIO', items: ['UF II', 'SM', 'Extra Wide'] },
      { name: 'DENTIUM', items: ['SuperLine', 'Implantium'] },
      { name: 'OSSTEM', items: ['TS III', 'MS'] },
      { name: 'MEGAGEN' },
      { name: 'STRAUMANN' }
    ]
  },
  {
    id: 2,
    name: 'Компоненты',
    slug: 'components',
    subcategories: [
      { name: 'Абатменты', items: ['Прямые', 'Угловые', 'Multi-unit'] },
      { name: 'Формирователи десны' },
      { name: 'Винты', items: ['Фиксирующие', 'Заглушки'] },
      { name: 'Слепочные трансферы' }
    ]
  },
  {
    id: 3,
    name: 'Костные материалы',
    slug: 'bone',
    subcategories: [
      { name: 'Гранулы', items: ['0.25-1мм', '1-2мм', '2-4мм'] },
      { name: 'Блоки' },
      { name: 'STRAUMANN', items: ['Cerabone', 'XenoGraft'] }
    ]
  },
  {
    id: 4,
    name: 'Мембраны',
    slug: 'membrane',
    subcategories: [
      { name: 'Коллагеновые', items: ['15x20', '20x30', '30x40'] },
      { name: 'PTFE' },
      { name: 'Титановые' }
    ]
  },
  {
    id: 5,
    name: 'Расходники',
    slug: 'supplies',
    subcategories: [
      { name: 'Инструменты', items: ['Боры', 'Фрезы'] },
      { name: 'Шовный материал' },
      { name: 'Антисептики' }
    ]
  }
]

function CategoryBar() {
  const location = useLocation()
  const [categories, setCategories] = useState(mockCategories)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Merge API data with subcategories from mock
          const mergedCategories = data.map(apiCat => {
            const mockCat = mockCategories.find(m => m.slug === apiCat.slug)
            return {
              ...apiCat,
              subcategories: mockCat?.subcategories || []
            }
          })
          setCategories(mergedCategories)
        }
      })
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  return (
    <nav className="category-bar">
      <div className="category-bar-content">
        {categories.map(category => {
          const isActive = location.pathname === `/category/${category.slug}`
          const IconComponent = categoryIcons[category.slug]
          const hasDropdown = category.subcategories && category.subcategories.length > 0
          const isDropdownOpen = activeDropdown === category.id

          return (
            <div
              key={category.id}
              className={`category-item-wrapper ${isDropdownOpen ? 'dropdown-open' : ''}`}
              onMouseEnter={() => hasDropdown && setActiveDropdown(category.id)}
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

              {/* Мега-меню dropdown */}
              {hasDropdown && isDropdownOpen && (
                <div className="mega-dropdown">
                  <div className="mega-dropdown-content">
                    {category.subcategories.map((sub, idx) => (
                      <div key={idx} className="mega-dropdown-column">
                        <Link
                          to={`/category/${category.slug}?sub=${encodeURIComponent(sub.name)}`}
                          className="mega-dropdown-title"
                        >
                          {sub.name}
                        </Link>
                        {sub.items && (
                          <ul className="mega-dropdown-list">
                            {sub.items.map((item, i) => (
                              <li key={i}>
                                <Link to={`/category/${category.slug}?sub=${encodeURIComponent(sub.name)}&item=${encodeURIComponent(item)}`}>
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
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
