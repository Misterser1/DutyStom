import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './CategoryBar.css'

// SVG иконки для категорий
const categoryIcons = {
  implants: (
    <svg viewBox="0 0 64 64" fill="currentColor">
      <path d="M32 4c-3 0-5.5 2-6.5 5l-1 4c-.5 2-.5 4 0 6l2 8c.5 2 .5 4 0 6l-2 8c-.5 2-.5 4 0 6l2 8c.5 2 .5 4 0 6l-1 4c1 3 3.5 5 6.5 5s5.5-2 6.5-5l-1-4c-.5-2-.5-4 0-6l2-8c.5-2 .5-4 0-6l-2-8c-.5-2-.5-4 0-6l2-8c.5-2 .5-4 0-6l-1-4c-1-3-3.5-5-6.5-5z"/>
      <ellipse cx="32" cy="8" rx="8" ry="4"/>
    </svg>
  ),
  components: (
    <svg viewBox="0 0 64 64" fill="currentColor">
      <circle cx="32" cy="16" r="10"/>
      <rect x="28" y="26" width="8" height="20" rx="2"/>
      <path d="M24 46h16l2 14H22l2-14z"/>
      <circle cx="32" cy="54" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  bone: (
    <svg viewBox="0 0 64 64" fill="currentColor">
      <rect x="20" y="8" width="24" height="48" rx="4"/>
      <rect x="24" y="12" width="16" height="8" rx="2" opacity="0.7"/>
      <circle cx="28" cy="32" r="2"/>
      <circle cx="36" cy="32" r="2"/>
      <circle cx="32" cy="38" r="2"/>
      <circle cx="28" cy="44" r="2"/>
      <circle cx="36" cy="44" r="2"/>
    </svg>
  ),
  membrane: (
    <svg viewBox="0 0 64 64" fill="currentColor">
      <rect x="12" y="16" width="40" height="8" rx="2" opacity="0.5"/>
      <rect x="12" y="28" width="40" height="8" rx="2" opacity="0.7"/>
      <rect x="12" y="40" width="40" height="8" rx="2"/>
    </svg>
  ),
  supplies: (
    <svg viewBox="0 0 64 64" fill="currentColor">
      <path d="M16 8l4 20h24l4-20H16zm2 4h28l-2 12H20l-2-12z"/>
      <rect x="22" y="32" width="20" height="4" rx="1"/>
      <path d="M28 36v20c0 2 1.8 4 4 4s4-2 4-4V36"/>
      <circle cx="32" cy="56" r="3"/>
    </svg>
  )
}

function CategoryBar() {
  const location = useLocation()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  return (
    <nav className="category-bar">
      <div className="category-bar-content">
        {categories.map(category => {
          const isActive = location.pathname === `/category/${category.slug}`
          const icon = categoryIcons[category.slug]
          return (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className={`category-item ${isActive ? 'active' : ''}`}
            >
              <span className="category-icon">
                {icon || <span className="icon-placeholder">📦</span>}
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
