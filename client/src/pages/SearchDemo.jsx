import { useState } from 'react'
import './SearchDemo.css'

const searchOptions = [
  { value: 'everywhere', label: 'Везде' },
  { value: 'title', label: 'В названии' },
  { value: 'catalog', label: 'В каталогах' },
  { value: 'description', label: 'В описании' },
  { value: 'article', label: 'По артикулу' },
  { value: 'manufacturer', label: 'По производителю' },
  { value: 'model', label: 'По модели' }
]

const variants = [
  {
    id: 1,
    name: 'Вариант 1: Классический dropdown',
    description: 'Выпадающий список слева от поиска',
    style: 'classic-dropdown'
  },
  {
    id: 2,
    name: 'Вариант 2: Иконка + dropdown внутри',
    description: 'Dropdown интегрирован внутри строки поиска',
    style: 'integrated-dropdown'
  },
  {
    id: 3,
    name: 'Вариант 3: Расширенный с кнопкой',
    description: 'Отдельная кнопка фильтра с выпадающим меню',
    style: 'filter-button'
  },
  {
    id: 4,
    name: 'Вариант 4: Tabs над поиском',
    description: 'Категории поиска в виде вкладок',
    style: 'tabs-above'
  },
  {
    id: 5,
    name: 'Вариант 5: Pills внутри поиска',
    description: 'Быстрый выбор категории таблетками',
    style: 'pills-inside'
  }
]

function SearchDemo() {
  const [selected, setSelected] = useState(null)
  const [searchType, setSearchType] = useState({})
  const [dropdownOpen, setDropdownOpen] = useState({})

  const toggleDropdown = (variantId) => {
    setDropdownOpen(prev => ({ ...prev, [variantId]: !prev[variantId] }))
  }

  return (
    <div className="search-demo-page">
      <div className="search-demo-header">
        <h1>Демо: Расширенный поиск</h1>
        <p>5 вариантов функционального поиска в вашем стиле</p>
      </div>

      <div className="search-variants-grid">
        {variants.map(variant => (
          <div
            key={variant.id}
            className={`search-variant-card ${selected === variant.id ? 'selected' : ''}`}
            onClick={() => setSelected(variant.id)}
          >
            <div className="search-variant-info">
              <h3>{variant.name}</h3>
              <p>{variant.description}</p>
            </div>

            {/* Header Preview */}
            <div className="search-header-preview">
              <div className="preview-logo-search">
                <img src="/images/logo2-dutystom.png" alt="DUTYSTOM" />
              </div>

              {/* Вариант 1: Classic Dropdown */}
              {variant.style === 'classic-dropdown' && (
                <div className="search-classic">
                  <div className="search-dropdown-wrapper">
                    <button
                      className="dropdown-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleDropdown(variant.id)
                      }}
                    >
                      {searchType[variant.id] || 'Везде'} ▼
                    </button>
                    {dropdownOpen[variant.id] && (
                      <div className="dropdown-menu-classic">
                        {searchOptions.map(opt => (
                          <div
                            key={opt.value}
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSearchType(prev => ({ ...prev, [variant.id]: opt.label }))
                              toggleDropdown(variant.id)
                            }}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input type="text" placeholder="Поиск товаров, имплантатов..." />
                  <button className="search-btn-demo">🔍</button>
                </div>
              )}

              {/* Вариант 2: Integrated Dropdown */}
              {variant.style === 'integrated-dropdown' && (
                <div className="search-integrated">
                  <button
                    className="integrated-dropdown-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(variant.id)
                    }}
                  >
                    🎯
                  </button>
                  {dropdownOpen[variant.id] && (
                    <div className="dropdown-menu-integrated">
                      {searchOptions.map(opt => (
                        <div
                          key={opt.value}
                          className="dropdown-item-integrated"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSearchType(prev => ({ ...prev, [variant.id]: opt.label }))
                            toggleDropdown(variant.id)
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="search-divider"></div>
                  <input type="text" placeholder={`Поиск ${searchType[variant.id] || 'везде'}...`} />
                  <button className="search-btn-demo">🔍</button>
                </div>
              )}

              {/* Вариант 3: Filter Button */}
              {variant.style === 'filter-button' && (
                <div className="search-filter">
                  <input type="text" placeholder="Поиск товаров, имплантатов..." />
                  <button
                    className="filter-toggle-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(variant.id)
                    }}
                  >
                    ⚙️ {searchType[variant.id] || 'Везде'}
                  </button>
                  {dropdownOpen[variant.id] && (
                    <div className="dropdown-menu-filter">
                      {searchOptions.map(opt => (
                        <div
                          key={opt.value}
                          className="dropdown-item-filter"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSearchType(prev => ({ ...prev, [variant.id]: opt.label }))
                            toggleDropdown(variant.id)
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="search-btn-demo">🔍</button>
                </div>
              )}

              {/* Вариант 4: Tabs Above */}
              {variant.style === 'tabs-above' && (
                <div className="search-tabs-container">
                  <div className="search-tabs">
                    {searchOptions.slice(0, 4).map(opt => (
                      <button
                        key={opt.value}
                        className={`tab-btn ${searchType[variant.id] === opt.label ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSearchType(prev => ({ ...prev, [variant.id]: opt.label }))
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                    <button
                      className="tab-more-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleDropdown(variant.id)
                      }}
                    >
                      Ещё... ▼
                    </button>
                    {dropdownOpen[variant.id] && (
                      <div className="dropdown-menu-tabs">
                        {searchOptions.slice(4).map(opt => (
                          <div
                            key={opt.value}
                            className="dropdown-item-tabs"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSearchType(prev => ({ ...prev, [variant.id]: opt.label }))
                              toggleDropdown(variant.id)
                            }}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="search-tabs-input">
                    <input type="text" placeholder={`Поиск ${searchType[variant.id] || 'везде'}...`} />
                    <button className="search-btn-demo">🔍</button>
                  </div>
                </div>
              )}

              {/* Вариант 5: Pills Inside */}
              {variant.style === 'pills-inside' && (
                <div className="search-pills">
                  <div className="pills-container">
                    {searchOptions.slice(0, 3).map(opt => (
                      <button
                        key={opt.value}
                        className={`pill-btn ${searchType[variant.id] === opt.label ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSearchType(prev => ({ ...prev, [variant.id]: opt.label }))
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                    <button
                      className="pill-more-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleDropdown(variant.id)
                      }}
                    >
                      +
                    </button>
                    {dropdownOpen[variant.id] && (
                      <div className="dropdown-menu-pills">
                        {searchOptions.slice(3).map(opt => (
                          <div
                            key={opt.value}
                            className="dropdown-item-pills"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSearchType(prev => ({ ...prev, [variant.id]: opt.label }))
                              toggleDropdown(variant.id)
                            }}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input type="text" placeholder="Введите запрос..." />
                  <button className="search-btn-demo">🔍</button>
                </div>
              )}

              <div className="preview-actions-search">
                <button className="action-btn-search">📞</button>
                <button className="action-btn-search">✉️</button>
                <button className="action-btn-search">🛒<span className="badge-search">3</span></button>
              </div>
            </div>

            {selected === variant.id && (
              <div className="selected-badge-search">✓ Выбран</div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div className="search-action-section">
          <button
            className="search-apply-btn"
            onClick={() => alert(`Применяю вариант ${selected}`)}
          >
            Применить вариант {selected}
          </button>
          <button className="search-reset-btn" onClick={() => setSelected(null)}>
            Сбросить
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchDemo
