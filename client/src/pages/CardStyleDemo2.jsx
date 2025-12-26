import { useState } from 'react'
import './CardStyleDemo2.css'

// Демо данные товара
const demoProduct = {
  id: 1,
  code: '07264',
  article: 'P3157516211',
  brand: 'MEGAGEN',
  country: 'Корея',
  name: 'BlueDiamond Regular Thread',
  description: 'Имплантат с обычной резьбой. Xpeed поверхность.',
  image_url: '/images/products/product-27.png',
  price: 13500,
  inStock: true,
  specs: {
    connection: 'Конус 10°',
    surface: 'Xpeed',
    diameters: '3.5, 4.0, 4.5, 5.0 мм',
    lengths: '7-15 мм',
    material: 'Титан Grade 4'
  }
}

function CardStyleDemo2() {
  const [selectedStyle, setSelectedStyle] = useState(1)
  const [quantity, setQuantity] = useState(1)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
  }

  return (
    <div className="card-demo2-page">
      <h1>Варианты карточки товара</h1>

      <div className="style-selector">
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            className={selectedStyle === num ? 'active' : ''}
            onClick={() => setSelectedStyle(num)}
          >
            Вариант {num}
          </button>
        ))}
      </div>

      <div className="demo-container">
        {/* Вариант 1: Горизонтальная с секциями */}
        {selectedStyle === 1 && (
          <div className="card-v1">
            <div className="card-v1-left">
              <div className="card-v1-code">КОД: {demoProduct.code}</div>
              <div className="card-v1-article">Арт.: {demoProduct.article}</div>
              <div className="card-v1-brand">{demoProduct.brand}</div>
              <div className="card-v1-country">{demoProduct.country}</div>
            </div>

            <div className="card-v1-image">
              <img src={demoProduct.image_url} alt={demoProduct.name} />
            </div>

            <div className="card-v1-info">
              <h3 className="card-v1-name">{demoProduct.name}</h3>
              <p className="card-v1-desc">{demoProduct.description}</p>
              <div className="card-v1-specs">
                {Object.entries(demoProduct.specs).map(([key, value]) => (
                  <div key={key} className="card-v1-spec">
                    <span className="spec-key">{key}:</span>
                    <span className="spec-val">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-v1-right">
              <div className="card-v1-price">{formatPrice(demoProduct.price)}</div>
              <div className={`card-v1-stock ${demoProduct.inStock ? 'in' : 'out'}`}>
                {demoProduct.inStock ? '● В наличии' : '○ Под заказ'}
              </div>
              <div className="card-v1-qty">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)}>+</button>
              </div>
              <button className="card-v1-cart-btn">В корзину</button>
              <a href="#" className="card-v1-detail-link">Детальная информация</a>
            </div>
          </div>
        )}

        {/* Вариант 2: Компактная горизонтальная */}
        {selectedStyle === 2 && (
          <div className="card-v2">
            <div className="card-v2-image">
              <img src={demoProduct.image_url} alt={demoProduct.name} />
              <span className="card-v2-brand-badge">{demoProduct.brand}</span>
            </div>

            <div className="card-v2-content">
              <div className="card-v2-header">
                <span className="card-v2-code">#{demoProduct.code}</span>
                <span className="card-v2-country">{demoProduct.country}</span>
              </div>
              <h3 className="card-v2-name">{demoProduct.name}</h3>
              <div className="card-v2-specs-row">
                {Object.entries(demoProduct.specs).slice(0, 3).map(([key, value]) => (
                  <span key={key} className="card-v2-chip">{value}</span>
                ))}
              </div>
            </div>

            <div className="card-v2-actions">
              <div className="card-v2-price-block">
                <span className="card-v2-price">{formatPrice(demoProduct.price)}</span>
                <span className={`card-v2-stock ${demoProduct.inStock ? 'in' : 'out'}`}>
                  {demoProduct.inStock ? 'В наличии' : 'Под заказ'}
                </span>
              </div>
              <div className="card-v2-buttons">
                <div className="card-v2-qty">
                  <button>−</button>
                  <span>{quantity}</span>
                  <button>+</button>
                </div>
                <button className="card-v2-cart">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>
              <a href="#" className="card-v2-link">Подробнее →</a>
            </div>
          </div>
        )}

        {/* Вариант 3: С боковой полосой характеристик */}
        {selectedStyle === 3 && (
          <div className="card-v3">
            <div className="card-v3-sidebar">
              <div className="card-v3-brand">{demoProduct.brand}</div>
              <div className="card-v3-country">{demoProduct.country}</div>
              <div className="card-v3-code">#{demoProduct.code}</div>
            </div>

            <div className="card-v3-image">
              <img src={demoProduct.image_url} alt={demoProduct.name} />
            </div>

            <div className="card-v3-main">
              <h3 className="card-v3-name">{demoProduct.name}</h3>
              <p className="card-v3-desc">{demoProduct.description}</p>
            </div>

            <div className="card-v3-specs">
              {Object.entries(demoProduct.specs).map(([key, value]) => (
                <div key={key} className="card-v3-spec-row">
                  <span className="card-v3-spec-label">{key}</span>
                  <span className="card-v3-spec-dots"></span>
                  <span className="card-v3-spec-value">{value}</span>
                </div>
              ))}
            </div>

            <div className="card-v3-actions">
              <div className="card-v3-price">{formatPrice(demoProduct.price)}</div>
              <div className={`card-v3-stock ${demoProduct.inStock ? 'in' : 'out'}`}>
                <span className="stock-dot"></span>
                {demoProduct.inStock ? 'В наличии' : 'Под заказ'}
              </div>
              <button className="card-v3-cart-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                В корзину
              </button>
            </div>
          </div>
        )}

        {/* Вариант 4: Карточки-блоки */}
        {selectedStyle === 4 && (
          <div className="card-v4">
            <div className="card-v4-header">
              <div className="card-v4-meta">
                <span className="card-v4-code">#{demoProduct.code}</span>
                <span className="card-v4-article">{demoProduct.article}</span>
              </div>
              <div className="card-v4-brand-block">
                <span className="card-v4-brand">{demoProduct.brand}</span>
                <span className="card-v4-country">{demoProduct.country}</span>
              </div>
            </div>

            <div className="card-v4-body">
              <div className="card-v4-image">
                <img src={demoProduct.image_url} alt={demoProduct.name} />
              </div>

              <div className="card-v4-info">
                <h3 className="card-v4-name">{demoProduct.name}</h3>
                <p className="card-v4-desc">{demoProduct.description}</p>

                <div className="card-v4-specs-grid">
                  {Object.entries(demoProduct.specs).map(([key, value]) => (
                    <div key={key} className="card-v4-spec-item">
                      <span className="card-v4-spec-key">{key}</span>
                      <span className="card-v4-spec-val">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-v4-purchase">
                <div className="card-v4-price-row">
                  <span className="card-v4-price-label">Цена:</span>
                  <span className="card-v4-price">{formatPrice(demoProduct.price)}</span>
                </div>
                <div className={`card-v4-stock ${demoProduct.inStock ? 'in' : 'out'}`}>
                  <span className="stock-indicator"></span>
                  {demoProduct.inStock ? 'В наличии' : 'Под заказ'}
                </div>
                <div className="card-v4-qty-row">
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q-1))}>−</button>
                  <input type="number" value={quantity} readOnly />
                  <button className="qty-btn" onClick={() => setQuantity(q => q+1)}>+</button>
                </div>
                <button className="card-v4-cart-btn">В корзину</button>
                <a href="#" className="card-v4-detail">Детальная информация</a>
              </div>
            </div>
          </div>
        )}

        {/* Вариант 5: Минималистичная с акцентами */}
        {selectedStyle === 5 && (
          <div className="card-v5">
            <div className="card-v5-accent-bar"></div>

            <div className="card-v5-content">
              <div className="card-v5-left">
                <div className="card-v5-image">
                  <img src={demoProduct.image_url} alt={demoProduct.name} />
                </div>
                <div className="card-v5-brand-info">
                  <span className="card-v5-brand">{demoProduct.brand}</span>
                  <span className="card-v5-country">{demoProduct.country}</span>
                </div>
              </div>

              <div className="card-v5-center">
                <div className="card-v5-codes">
                  <span>Код: {demoProduct.code}</span>
                  <span>Арт: {demoProduct.article}</span>
                </div>
                <h3 className="card-v5-name">{demoProduct.name}</h3>
                <p className="card-v5-desc">{demoProduct.description}</p>
                <div className="card-v5-specs">
                  {Object.entries(demoProduct.specs).map(([key, value]) => (
                    <div key={key} className="card-v5-spec">
                      <span className="key">{key}:</span>
                      <span className="val">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-v5-right">
                <div className="card-v5-price">{formatPrice(demoProduct.price)}</div>
                <div className={`card-v5-stock ${demoProduct.inStock ? 'in' : 'out'}`}>
                  {demoProduct.inStock ? '✓ В наличии' : '○ Под заказ'}
                </div>
                <div className="card-v5-actions">
                  <div className="card-v5-qty">
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(q => q+1)}>+</button>
                  </div>
                  <button className="card-v5-cart">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    В корзину
                  </button>
                </div>
                <a href="#" className="card-v5-detail">Подробнее</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CardStyleDemo2
