import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './CategoryBar.css'

// Изображения категорий
const categoryImages = {
  implants: '/images/categories/implants.png',
  components: '/images/categories/components.png',
  bone: '/images/categories/bone-materials.png',
  membrane: '/images/categories/membranes.png',
  supplies: '/images/categories/consumables.png'
}

// Моковые данные для работы без бэкенда
const mockCategories = [
  { id: 1, name: 'Имплантаты', slug: 'implants' },
  { id: 2, name: 'Компоненты', slug: 'components' },
  { id: 3, name: 'Костные материалы', slug: 'bone' },
  { id: 4, name: 'Мембраны', slug: 'membrane' },
  { id: 5, name: 'Расходники', slug: 'supplies' }
]

function CategoryBar() {
  const location = useLocation()
  const [categories, setCategories] = useState(mockCategories)

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCategories(data)
        }
      })
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  return (
    <nav className="category-bar">
      <div className="category-bar-content">
        {categories.map(category => {
          const isActive = location.pathname === `/category/${category.slug}`
          const imageSrc = categoryImages[category.slug]
          return (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className={`category-item ${isActive ? 'active' : ''}`}
            >
              <span className="category-icon">
                {imageSrc ? (
                  <img src={imageSrc} alt={category.name} className="category-image" />
                ) : (
                  <span className="icon-placeholder">📦</span>
                )}
              </span>
              <span className="category-name">{category.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default CategoryBar
