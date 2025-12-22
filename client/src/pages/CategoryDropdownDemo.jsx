import { useState } from 'react'
import { categoryIcons } from '../components/CategoryIcons/CategoryIcons'
import './CategoryDropdownDemo.css'

// Данные категорий с подкатегориями
const categoriesWithSubs = [
  {
    id: 1,
    name: 'Имплантаты',
    slug: 'implants',
    subcategories: [
      { name: 'DIO', items: ['UF II', 'SM', 'Extra Wide'] },
      { name: 'DENTIUM', items: ['SuperLine', 'Implantium'] },
      { name: 'OSSTEM', items: ['TS III', 'MS', 'Ultra Wide'] },
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
      { name: 'Шприцы' },
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
      { name: 'Титановые' },
      { name: 'Резорбируемые' }
    ]
  },
  {
    id: 5,
    name: 'Расходники',
    slug: 'supplies',
    subcategories: [
      { name: 'Инструменты', items: ['Боры', 'Фрезы', 'Развёртки'] },
      { name: 'Шовный материал' },
      { name: 'Антисептики' },
      { name: 'Ирригация' }
    ]
  }
]

// Общий компонент мега-меню
function MegaMenu({ variant, activeCategory, setActiveCategory }) {
  return (
    <div className={`mega-menu-bar mega-menu-${variant}`}>
      {categoriesWithSubs.map(cat => {
        const IconComponent = categoryIcons[cat.slug]
        const isActive = activeCategory === cat.id

        return (
          <div
            key={cat.id}
            className={`mega-menu-item ${isActive ? 'active' : ''}`}
            onMouseEnter={() => setActiveCategory(cat.id)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="mega-menu-trigger">
              <span className="mega-menu-icon">
                {IconComponent && <IconComponent />}
              </span>
              <span className="mega-menu-name">{cat.name}</span>
            </div>

            {isActive && (
              <div className="mega-dropdown">
                <div className="mega-dropdown-content">
                  {cat.subcategories.map((sub, idx) => (
                    <div key={idx} className="mega-dropdown-column">
                      <h4 className="mega-dropdown-title">{sub.name}</h4>
                      {sub.items && (
                        <ul className="mega-dropdown-list">
                          {sub.items.map((item, i) => (
                            <li key={i}><a href="#">{item}</a></li>
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
  )
}

function CategoryDropdownDemo() {
  const [activeV1, setActiveV1] = useState(null)
  const [activeV2, setActiveV2] = useState(null)
  const [activeV3, setActiveV3] = useState(null)
  const [activeV4, setActiveV4] = useState(null)
  const [activeV5, setActiveV5] = useState(null)

  return (
    <div className="dropdown-demo-page">
      <h1 className="demo-title">Мега-меню категорий</h1>
      <p className="demo-subtitle">5 вариантов дизайна выпадающего меню</p>

      {/* Вариант 1: Классический */}
      <section className="demo-section">
        <div className="demo-header">
          <h2>Вариант 1: Классический</h2>
          <p>Как на референсе - teal фон, белый dropdown, колонки</p>
        </div>
        <MegaMenu variant="v1" activeCategory={activeV1} setActiveCategory={setActiveV1} />
      </section>

      {/* Вариант 2: Градиентный */}
      <section className="demo-section">
        <div className="demo-header">
          <h2>Вариант 2: Градиентный</h2>
          <p>Градиент на категориях, тень под dropdown</p>
        </div>
        <MegaMenu variant="v2" activeCategory={activeV2} setActiveCategory={setActiveV2} />
      </section>

      {/* Вариант 3: Минималистичный */}
      <section className="demo-section">
        <div className="demo-header">
          <h2>Вариант 3: Минималистичный</h2>
          <p>Светлый фон, тонкие линии, компактный</p>
        </div>
        <MegaMenu variant="v3" activeCategory={activeV3} setActiveCategory={setActiveV3} />
      </section>

      {/* Вариант 4: Карточки */}
      <section className="demo-section">
        <div className="demo-header">
          <h2>Вариант 4: Карточки</h2>
          <p>Категории как отдельные карточки с поднятием</p>
        </div>
        <MegaMenu variant="v4" activeCategory={activeV4} setActiveCategory={setActiveV4} />
      </section>

      {/* Вариант 5: Glass-морфизм */}
      <section className="demo-section demo-section-dark">
        <div className="demo-header">
          <h2>Вариант 5: Glass-морфизм</h2>
          <p>Полупрозрачный dropdown с blur эффектом</p>
        </div>
        <MegaMenu variant="v5" activeCategory={activeV5} setActiveCategory={setActiveV5} />
      </section>
    </div>
  )
}

export default CategoryDropdownDemo
