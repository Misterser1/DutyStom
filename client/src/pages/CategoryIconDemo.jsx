import { useState, useEffect } from 'react'
import './CategoryIconDemo.css'

const CategoryIconDemo = () => {
  const [categories, setCategories] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  const variants = [
    {
      id: 1,
      name: 'Вариант 1: Классические карточки',
      description: 'Иконки сверху, текст снизу, стеклянный эффект',
      className: 'variant-classic-cards'
    },
    {
      id: 2,
      name: 'Вариант 2: Большие круги',
      description: 'Круглые контейнеры с крупными иконками',
      className: 'variant-large-circles'
    },
    {
      id: 3,
      name: 'Вариант 3: Градиентные боксы',
      description: 'Прямоугольные карточки с зеленым градиентом',
      className: 'variant-gradient-boxes'
    },
    {
      id: 4,
      name: 'Вариант 4: Иконка + Бейдж',
      description: 'Большие иконки с названием в бейдже',
      className: 'variant-icon-badge'
    },
    {
      id: 5,
      name: 'Вариант 5: Премиум стиль',
      description: 'Элегантные карточки с эффектом свечения',
      className: 'variant-premium-glow'
    }
  ]

  return (
    <div className="category-icon-demo-page">
      <div className="demo-header-categories">
        <h1>Демо: 5 вариантов иконок категорий</h1>
        <p>Выберите понравившийся стиль (иконки 50-60px, зелёный градиент)</p>
      </div>

      <div className="variants-container-categories">
        {variants.map(variant => (
          <div
            key={variant.id}
            className={`variant-preview-card-cat ${selectedVariant === variant.id ? 'selected-cat' : ''}`}
            onClick={() => setSelectedVariant(variant.id)}
          >
            <div className="variant-info-cat">
              <h3>{variant.name}</h3>
              <p>{variant.description}</p>
            </div>

            <div className={`category-demo-bar ${variant.className}`}>
              {categories.map(category => (
                <div key={category.id} className="demo-category-item">
                  <div className="demo-icon-container">
                    {category.icon_url ? (
                      <img src={category.icon_url} alt={category.name} />
                    ) : (
                      <span className="placeholder-icon">📦</span>
                    )}
                  </div>
                  {variant.className !== 'variant-gradient-boxes' || variant.id === 3 ? (
                    <span className="demo-category-name">{category.name}</span>
                  ) : null}
                </div>
              ))}
            </div>

            {selectedVariant === variant.id && (
              <div className="selected-indicator-cat">✓ Выбрано</div>
            )}
          </div>
        ))}
      </div>

      {selectedVariant && (
        <div className="action-section-cat">
          <button
            className="btn-apply-cat"
            onClick={() => alert(`Применить вариант ${selectedVariant}. Сейчас скажите мне какой вариант применить, и я обновлю CategoryBar.css!`)}
          >
            Применить вариант {selectedVariant}
          </button>
          <button
            className="btn-reset-cat"
            onClick={() => setSelectedVariant(null)}
          >
            Сбросить выбор
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryIconDemo
