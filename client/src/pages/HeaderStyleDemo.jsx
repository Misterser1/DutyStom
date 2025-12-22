import './HeaderStyleDemo.css'

const categories = [
  { icon: '🦷', name: 'Имплантаты' },
  { icon: '🔩', name: 'Компоненты' },
  { icon: '🦴', name: 'Костные материалы' },
  { icon: '📋', name: 'Мембраны' },
  { icon: '🧪', name: 'Расходники' }
]

function HeaderStyleDemo() {
  return (
    <div className="header-style-demo">
      <h1>5 Вариантов дизайна верхней части сайта</h1>
      <p className="demo-description">
        Header + Категории + InfoBar в разных стилях
      </p>

      {/* Вариант 1: Glassmorphism */}
      <div className="demo-section-header">
        <h2>Вариант 1: Glassmorphism (Стекло)</h2>
        <p>Полупрозрачные элементы с размытием на ярком градиентном фоне</p>
        <div className="v1-container">
          <div className="mock-header v1-header">
            <div className="mock-logo v1-logo">🦷 DUTYSTOM</div>
            <div className="mock-search v1-search">
              <span>Везде ▼</span>
              <span className="mock-search-text v1-search-text">Поиск товаров...</span>
              <span>🔍</span>
            </div>
            <div className="mock-contacts">
              <div className="mock-contact-badge v1-contact">📞 +7 930-950-88-87</div>
              <div className="mock-contact-badge v1-contact">✉️ info@dutystom.ru</div>
              <div className="mock-social-btn v1-social">Мы в соцсетях ▼</div>
            </div>
            <div className="mock-cart v1-cart">🛒</div>
          </div>
          <div className="mock-categories v1-categories">
            {categories.map((cat, i) => (
              <div key={i} className="mock-category v1-category">
                <div className="mock-category-icon">{cat.icon}</div>
                <div className="mock-category-name">{cat.name}</div>
              </div>
            ))}
          </div>
          <div className="mock-infobar v1-infobar">
            <div className="mock-education">📚 Обучение и вебинары ▼</div>
          </div>
        </div>
      </div>

      {/* Вариант 2: Минималистичный белый */}
      <div className="demo-section-header">
        <h2>Вариант 2: Минималистичный</h2>
        <p>Чистый белый дизайн с тонкими рамками и акцентами</p>
        <div className="v2-container">
          <div className="mock-header v2-header">
            <div className="mock-logo v2-logo">🦷 DUTYSTOM</div>
            <div className="mock-search v2-search">
              <span>Везде ▼</span>
              <span className="mock-search-text v2-search-text">Поиск товаров...</span>
              <span>🔍</span>
            </div>
            <div className="mock-contacts">
              <div className="mock-contact-badge v2-contact">📞 +7 930-950-88-87</div>
              <div className="mock-contact-badge v2-contact">✉️ info@dutystom.ru</div>
              <div className="mock-social-btn v2-social">Мы в соцсетях ▼</div>
            </div>
            <div className="mock-cart v2-cart">🛒</div>
          </div>
          <div className="mock-categories v2-categories">
            {categories.map((cat, i) => (
              <div key={i} className="mock-category v2-category">
                <div className="mock-category-icon v2-category-icon">{cat.icon}</div>
                <div className="mock-category-name">{cat.name}</div>
              </div>
            ))}
          </div>
          <div className="mock-infobar v2-infobar">
            <div className="mock-education">📚 Обучение и вебинары ▼</div>
          </div>
        </div>
      </div>

      {/* Вариант 3: Объединённый градиент */}
      <div className="demo-section-header">
        <h2>Вариант 3: Объединённый градиент</h2>
        <p>Header и категории в одном плавном градиенте, категории белые</p>
        <div className="v3-container">
          <div className="mock-header v3-header">
            <div className="mock-logo v3-logo">🦷 DUTYSTOM</div>
            <div className="mock-search v3-search">
              <span>Везде ▼</span>
              <span className="mock-search-text v3-search-text">Поиск товаров...</span>
              <span>🔍</span>
            </div>
            <div className="mock-contacts">
              <div className="mock-contact-badge v3-contact">📞 +7 930-950-88-87</div>
              <div className="mock-contact-badge v3-contact">✉️ info@dutystom.ru</div>
              <div className="mock-social-btn v3-social">Мы в соцсетях ▼</div>
            </div>
            <div className="mock-cart v3-cart">🛒</div>
          </div>
          <div className="mock-categories v3-categories">
            {categories.map((cat, i) => (
              <div key={i} className="mock-category v3-category">
                <div className="mock-category-icon">{cat.icon}</div>
                <div className="mock-category-name">{cat.name}</div>
              </div>
            ))}
          </div>
          <div className="mock-infobar v3-infobar">
            <div className="mock-education">📚 Обучение и вебинары ▼</div>
          </div>
        </div>
      </div>

      {/* Вариант 4: Тёмная тема */}
      <div className="demo-section-header">
        <h2>Вариант 4: Тёмная тема</h2>
        <p>Тёмный фон с неоновыми зелёными акцентами</p>
        <div className="v4-container">
          <div className="mock-header v4-header">
            <div className="mock-logo v4-logo">🦷 DUTYSTOM</div>
            <div className="mock-search v4-search">
              <span>Везде ▼</span>
              <span className="mock-search-text v4-search-text">Поиск товаров...</span>
              <span>🔍</span>
            </div>
            <div className="mock-contacts">
              <div className="mock-contact-badge v4-contact">📞 +7 930-950-88-87</div>
              <div className="mock-contact-badge v4-contact">✉️ info@dutystom.ru</div>
              <div className="mock-social-btn v4-social">Мы в соцсетях ▼</div>
            </div>
            <div className="mock-cart v4-cart">🛒</div>
          </div>
          <div className="mock-categories v4-categories">
            {categories.map((cat, i) => (
              <div key={i} className="mock-category v4-category">
                <div className="mock-category-icon">{cat.icon}</div>
                <div className="mock-category-name">{cat.name}</div>
              </div>
            ))}
          </div>
          <div className="mock-infobar v4-infobar">
            <div className="mock-education">📚 Обучение и вебинары ▼</div>
          </div>
        </div>
      </div>

      {/* Вариант 5: Современный с акцентами */}
      <div className="demo-section-header">
        <h2>Вариант 5: Современный с акцентами</h2>
        <p>Белый header, градиентные категории с эффектом блика (как карточки товаров)</p>
        <div className="v5-container">
          <div className="mock-header v5-header">
            <div className="mock-logo v5-logo">🦷 DUTYSTOM</div>
            <div className="mock-search v5-search">
              <span>Везде ▼</span>
              <span className="mock-search-text v5-search-text">Поиск товаров...</span>
              <span>🔍</span>
            </div>
            <div className="mock-contacts">
              <div className="mock-contact-badge v5-contact">📞 +7 930-950-88-87</div>
              <div className="mock-contact-badge v5-contact">✉️ info@dutystom.ru</div>
              <div className="mock-social-btn v5-social">Мы в соцсетях ▼</div>
            </div>
            <div className="mock-cart v5-cart">🛒</div>
          </div>
          <div className="mock-categories v5-categories">
            {categories.map((cat, i) => (
              <div key={i} className="mock-category v5-category">
                <div className="mock-category-icon">{cat.icon}</div>
                <div className="mock-category-name">{cat.name}</div>
              </div>
            ))}
          </div>
          <div className="mock-infobar v5-infobar">
            <div className="mock-education">
              <span className="v5-education-icon">📚</span> Обучение и вебинары ▼
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderStyleDemo
