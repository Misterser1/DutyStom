import './DesignStyleDemo.css'

function DesignStyleDemo() {
  return (
    <div className="design-demo">
      <h1>5 Вариантов улучшения дизайна</h1>
      <p className="demo-description">
        Сравните стили карточек товаров. Каждый вариант добавляет объём и глубину.
      </p>

      {/* Вариант 1: Neumorphism */}
      <div className="demo-section">
        <h2>Вариант 1: Neumorphism (Неоморфизм)</h2>
        <p>Мягкие выпуклые элементы с двойными тенями - эффект "вдавленных" и "выпуклых" кнопок</p>
        <div className="neumorphism-container">
          <div className="neumorphism-card">
            <div className="product-image">80x80</div>
            <div className="product-info">
              <span className="product-brand">DIO</span>
              <div className="product-name">DIO UF II HSA</div>
              <div className="product-price">2 500 ₽</div>
            </div>
            <div className="product-actions">
              <div className="quantity-control">
                <button className="qty-btn">-</button>
                <input type="text" className="qty-input" value="1" readOnly />
                <button className="qty-btn">+</button>
              </div>
              <button className="neumorphism-btn">В корзину</button>
            </div>
          </div>
          <div className="neumorphism-card">
            <div className="product-image">80x80</div>
            <div className="product-info">
              <span className="product-brand">TITAN</span>
              <div className="product-name">TITAN B Vial 0.25g</div>
              <div className="product-price">3 000 ₽</div>
            </div>
            <div className="product-actions">
              <div className="quantity-control">
                <button className="qty-btn">-</button>
                <input type="text" className="qty-input" value="1" readOnly />
                <button className="qty-btn">+</button>
              </div>
              <button className="neumorphism-btn">В корзину</button>
            </div>
          </div>
        </div>
      </div>

      {/* Вариант 2: Glassmorphism */}
      <div className="demo-section">
        <h2>Вариант 2: Glassmorphism (Стекло)</h2>
        <p>Полупрозрачные элементы с размытием фона - эффект матового стекла</p>
        <div className="glass-container">
          <div className="glass-card">
            <div className="product-image">80x80</div>
            <div className="product-info">
              <span className="product-brand">DIO</span>
              <div className="product-name">DIO UF II HSA</div>
              <div className="product-price">2 500 ₽</div>
            </div>
            <div className="product-actions">
              <div className="quantity-control">
                <button className="qty-btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}}>-</button>
                <input type="text" className="qty-input" value="1" readOnly style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}} />
                <button className="qty-btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}}>+</button>
              </div>
              <button className="glass-btn">В корзину</button>
            </div>
          </div>
          <div className="glass-card">
            <div className="product-image">80x80</div>
            <div className="product-info">
              <span className="product-brand">TITAN</span>
              <div className="product-name">TITAN B Vial 0.25g</div>
              <div className="product-price">3 000 ₽</div>
            </div>
            <div className="product-actions">
              <div className="quantity-control">
                <button className="qty-btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}}>-</button>
                <input type="text" className="qty-input" value="1" readOnly style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}} />
                <button className="qty-btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}}>+</button>
              </div>
              <button className="glass-btn">В корзину</button>
            </div>
          </div>
        </div>
      </div>

      {/* Вариант 3: Deep Shadows + Rounded */}
      <div className="demo-section">
        <h2>Вариант 3: Глубокие тени + скругления</h2>
        <p>Увеличенный border-radius (20-30px) + многослойные тени для объёма</p>
        <div className="rounded-container">
          <div className="rounded-card">
            <div className="product-image">90x90</div>
            <div className="product-info">
              <span className="product-brand">DIO</span>
              <div className="product-name">DIO UF II HSA</div>
              <div className="product-price">2 500 ₽</div>
            </div>
            <div className="product-actions">
              <div className="quantity-control">
                <button className="qty-btn" style={{borderRadius: '10px'}}>-</button>
                <input type="text" className="qty-input" value="1" readOnly style={{borderRadius: '10px'}} />
                <button className="qty-btn" style={{borderRadius: '10px'}}>+</button>
              </div>
              <button className="rounded-btn">В корзину</button>
            </div>
          </div>
          <div className="rounded-card">
            <div className="product-image">90x90</div>
            <div className="product-info">
              <span className="product-brand">TITAN</span>
              <div className="product-name">TITAN B Vial 0.25g</div>
              <div className="product-price">3 000 ₽</div>
            </div>
            <div className="product-actions">
              <div className="quantity-control">
                <button className="qty-btn" style={{borderRadius: '10px'}}>-</button>
                <input type="text" className="qty-input" value="1" readOnly style={{borderRadius: '10px'}} />
                <button className="qty-btn" style={{borderRadius: '10px'}}>+</button>
              </div>
              <button className="rounded-btn">В корзину</button>
            </div>
          </div>
        </div>
      </div>

      {/* Вариант 4: Gradient Cards */}
      <div className="demo-section">
        <h2>Вариант 4: Градиентные карточки</h2>
        <p>Цветовые градиенты на элементах + эффект блика при наведении</p>
        <div className="gradient-container">
          <div className="gradient-card">
            <div className="product-image">80x80</div>
            <div className="product-info">
              <span className="product-brand">DIO</span>
              <div className="product-name">DIO UF II HSA</div>
              <div className="product-price">2 500 ₽</div>
            </div>
            <div className="product-actions">
              <div className="quantity-control">
                <button className="qty-btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}}>-</button>
                <input type="text" className="qty-input" value="1" readOnly style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}} />
                <button className="qty-btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}}>+</button>
              </div>
              <button className="gradient-btn">В корзину</button>
            </div>
          </div>
          <div className="gradient-card">
            <div className="product-image">80x80</div>
            <div className="product-info">
              <span className="product-brand">TITAN</span>
              <div className="product-name">TITAN B Vial 0.25g</div>
              <div className="product-price">3 000 ₽</div>
            </div>
            <div className="product-actions">
              <div className="quantity-control">
                <button className="qty-btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}}>-</button>
                <input type="text" className="qty-input" value="1" readOnly style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}} />
                <button className="qty-btn" style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none'}}>+</button>
              </div>
              <button className="gradient-btn">В корзину</button>
            </div>
          </div>
        </div>
      </div>

      {/* Вариант 5: Elevated Cards */}
      <div className="demo-section">
        <h2>Вариант 5: Elevated Cards (подъём карточек)</h2>
        <p>Карточки "парят" над фоном + hover-эффекты с подъёмом и увеличением тени</p>
        <div className="elevated-container">
          <div className="elevated-card">
            <div className="product-image">80x80</div>
            <div className="product-info">
              <div>
                <span className="product-brand">DIO</span>
                <span className="product-code">DIO</span>
              </div>
              <div className="product-name">DIO UF II HSA</div>
              <div className="product-price">2 500 ₽</div>
            </div>
            <div className="product-actions">
              <span className="stock-badge">В наличии</span>
              <div className="quantity-control">
                <button className="qty-btn">-</button>
                <input type="text" className="qty-input" value="1" readOnly />
                <button className="qty-btn">+</button>
              </div>
              <button className="elevated-btn">В корзину</button>
            </div>
          </div>
          <div className="elevated-card">
            <div className="product-image">80x80</div>
            <div className="product-info">
              <div>
                <span className="product-brand">TITAN</span>
                <span className="product-code">TBV02025</span>
              </div>
              <div className="product-name">TITAN B Vial 0.25g 0.2-1.0mm</div>
              <div className="product-price">3 000 ₽</div>
            </div>
            <div className="product-actions">
              <span className="stock-badge">В наличии</span>
              <div className="quantity-control">
                <button className="qty-btn">-</button>
                <input type="text" className="qty-input" value="1" readOnly />
                <button className="qty-btn">+</button>
              </div>
              <button className="elevated-btn">В корзину</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesignStyleDemo
