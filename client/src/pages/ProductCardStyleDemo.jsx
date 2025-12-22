import { useState } from 'react'
import './ProductCardStyleDemo.css'

// Демо товар
const demoProduct = {
  id: 1,
  code: '12345',
  article: 'IMP-4510',
  brand: 'Osstem',
  country: 'Ю.Корея',
  name: 'Имплантат TS III SA 4.5x10mm',
  category: 'Имплантаты',
  price: 12500,
  oldPrice: 15000,
  inStock: true
}

function ProductCardStyleDemo() {
  const [selectedVariant, setSelectedVariant] = useState(null)

  const variants = [
    { id: 1, name: 'Ультра-компакт', description: 'Минимум элементов, одна тонкая строка' },
    { id: 2, name: 'С градиентом', description: 'Градиентная полоса слева, компактная' },
    { id: 3, name: 'Разделители', description: 'Тонкие линии между секциями' },
    { id: 4, name: 'Инлайн', description: 'Всё в одну линию горизонтально' },
    { id: 5, name: 'Двухрядная', description: 'Информация сверху, действия снизу' }
  ]

  const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(price)

  return (
    <div className="card-style-demo-page">
      <h1>Демо: Компактные карточки товаров</h1>
      <p className="demo-subtitle">Без закладок, доставки, купить в 1 клик. С наличием и детальной информацией.</p>

      {variants.map(variant => (
        <section
          key={variant.id}
          className={`variant-section ${selectedVariant === variant.id ? 'selected' : ''}`}
          onClick={() => setSelectedVariant(variant.id)}
        >
          <div className="variant-header">
            <div className="variant-info">
              <h2>Вариант {variant.id}: {variant.name}</h2>
              <p className="variant-desc">{variant.description}</p>
            </div>
            {selectedVariant === variant.id && <span className="selected-badge">Выбрано</span>}
          </div>

          {/* Вариант 1: Ультра-компакт */}
          {variant.id === 1 && (
            <div className="card-preview">
              <div className="compact-v1">
                <div className="compact-v1-image">
                  <div className="img-placeholder-sm">
                    <svg viewBox="0 0 64 64" fill="currentColor">
                      <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
                    </svg>
                  </div>
                </div>
                <div className="compact-v1-brand">{demoProduct.brand}</div>
                <div className="compact-v1-name">
                  <span className="art">{demoProduct.article}</span>
                  <span className="title">{demoProduct.name}</span>
                </div>
                <div className="compact-v1-stock">В наличии: есть</div>
                <div className="compact-v1-price">
                  <span className="current">{formatPrice(demoProduct.price)} ₽</span>
                </div>
                <div className="compact-v1-actions">
                  <div className="qty-mini">
                    <button>−</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                  <button className="cart-btn-mini">В корзину</button>
                </div>
                <a href="#" className="detail-link-mini">Детальная информация</a>
              </div>
            </div>
          )}

          {/* Вариант 2: С градиентом */}
          {variant.id === 2 && (
            <div className="card-preview">
              <div className="compact-v2">
                <div className="gradient-line"></div>
                <div className="compact-v2-image">
                  <div className="img-placeholder-sm">
                    <svg viewBox="0 0 64 64" fill="currentColor">
                      <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
                    </svg>
                  </div>
                </div>
                <div className="compact-v2-info">
                  <div className="info-top">
                    <span className="brand">{demoProduct.brand}</span>
                    <span className="code">КОД: {demoProduct.code}</span>
                    <span className="stock-badge">В наличии</span>
                  </div>
                  <div className="info-name">{demoProduct.name}</div>
                </div>
                <div className="compact-v2-price">{formatPrice(demoProduct.price)} ₽</div>
                <div className="compact-v2-actions">
                  <div className="qty-mini">
                    <button>−</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                  <button className="cart-btn-mini">В корзину</button>
                  <a href="#" className="detail-link-mini">Детали</a>
                </div>
              </div>
            </div>
          )}

          {/* Вариант 3: Разделители */}
          {variant.id === 3 && (
            <div className="card-preview">
              <div className="compact-v3">
                <div className="compact-v3-image">
                  <div className="img-placeholder-sm">
                    <svg viewBox="0 0 64 64" fill="currentColor">
                      <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
                    </svg>
                  </div>
                </div>
                <div className="v3-divider"></div>
                <div className="compact-v3-meta">
                  <span className="brand">{demoProduct.brand}</span>
                  <span className="code">{demoProduct.article}</span>
                </div>
                <div className="v3-divider"></div>
                <div className="compact-v3-name">{demoProduct.name}</div>
                <div className="v3-divider"></div>
                <div className="compact-v3-stock">В наличии</div>
                <div className="v3-divider"></div>
                <div className="compact-v3-price">{formatPrice(demoProduct.price)} ₽</div>
                <div className="v3-divider"></div>
                <div className="compact-v3-actions">
                  <div className="qty-mini">
                    <button>−</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                  <button className="cart-btn-mini">В корзину</button>
                  <a href="#" className="detail-link-mini">Детали</a>
                </div>
              </div>
            </div>
          )}

          {/* Вариант 4: Инлайн */}
          {variant.id === 4 && (
            <div className="card-preview">
              <div className="compact-v4">
                <div className="compact-v4-image">
                  <div className="img-placeholder-xs">
                    <svg viewBox="0 0 64 64" fill="currentColor">
                      <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
                    </svg>
                  </div>
                </div>
                <span className="compact-v4-brand">{demoProduct.brand}</span>
                <span className="compact-v4-article">{demoProduct.article}</span>
                <span className="compact-v4-name">{demoProduct.name}</span>
                <span className="compact-v4-stock">В наличии</span>
                <span className="compact-v4-price">{formatPrice(demoProduct.price)} ₽</span>
                <div className="compact-v4-qty">
                  <button>−</button>
                  <span>1</span>
                  <button>+</button>
                </div>
                <button className="compact-v4-cart">В корзину</button>
                <a href="#" className="compact-v4-detail">Детали</a>
              </div>
            </div>
          )}

          {/* Вариант 5: Двухрядная */}
          {variant.id === 5 && (
            <div className="card-preview">
              <div className="compact-v5">
                <div className="compact-v5-row1">
                  <div className="compact-v5-image">
                    <div className="img-placeholder-sm">
                      <svg viewBox="0 0 64 64" fill="currentColor">
                        <rect x="8" y="16" width="48" height="32" rx="4" opacity="0.3"/>
                      </svg>
                    </div>
                  </div>
                  <div className="compact-v5-brand">{demoProduct.brand}</div>
                  <div className="compact-v5-article">{demoProduct.article}</div>
                  <div className="compact-v5-name">{demoProduct.name}</div>
                  <div className="compact-v5-stock">В наличии</div>
                </div>
                <div className="compact-v5-row2">
                  <div className="compact-v5-price">{formatPrice(demoProduct.price)} ₽</div>
                  <div className="compact-v5-actions">
                    <div className="qty-mini">
                      <button>−</button>
                      <span>1</span>
                      <button>+</button>
                    </div>
                    <button className="cart-btn-mini">В корзину</button>
                    <a href="#" className="detail-link-mini">Детальная информация</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      ))}

      {selectedVariant && (
        <div className="demo-actions">
          <button
            className="apply-btn"
            onClick={() => alert(`Применён вариант ${selectedVariant}: ${variants.find(v => v.id === selectedVariant)?.name}`)}
          >
            Применить вариант {selectedVariant}
          </button>
          <button className="reset-btn" onClick={() => setSelectedVariant(null)}>
            Сбросить выбор
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductCardStyleDemo
