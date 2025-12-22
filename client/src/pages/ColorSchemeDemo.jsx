import './ColorSchemeDemo.css'

function ColorSchemeDemo() {
  return (
    <div className="color-demo">
      <h1>Новая цветовая схема сайта</h1>
      <p className="demo-description">Бирюзовый + Бежевый/Кремовый</p>

      {/* Полная имитация сайта */}
      <div className="site-preview">
        {/* Header */}
        <header className="preview-header">
          <div className="preview-header-content">
            <div className="preview-logo">
              <img src="/images/logo.png" alt="DUTYSTOM" className="logo-img" />
            </div>
            <div className="preview-search">
              <span className="search-dropdown">Везде <img src="/images/ui-icons/dropdown.png" alt="" className="dropdown-icon" /></span>
              <input type="text" placeholder="Поиск товаров..." className="search-input" />
              <button className="search-btn">
                <img src="/images/ui-icons/search.png" alt="Поиск" className="ui-icon" />
              </button>
            </div>
            <div className="preview-contacts">
              <a href="tel:+79309508887" className="contact-badge-new">
                <img src="/images/ui-icons/phone.png" alt="" className="ui-icon-sm" />
                +7 930-950-88-87
              </a>
              <a href="mailto:info@dutystom.ru" className="contact-badge-new">
                <img src="/images/ui-icons/email.png" alt="" className="ui-icon-sm" />
                info@dutystom.ru
              </a>
              <div className="social-dropdown-new">
                <span className="social-btn-new">Мы в соцсетях <img src="/images/ui-icons/dropdown.png" alt="" className="dropdown-icon-dark" /></span>
                <div className="social-menu-new">
                  <a href="#"><img src="/images/ui-icons/telegram.png" alt="" className="social-icon" /> Telegram</a>
                  <a href="#"><img src="/images/ui-icons/whatsapp.png" alt="" className="social-icon" /> WhatsApp</a>
                  <a href="#"><img src="/images/ui-icons/vk.png" alt="" className="social-icon" /> ВКонтакте</a>
                  <a href="#"><img src="/images/ui-icons/youtube.png" alt="" className="social-icon" /> YouTube</a>
                </div>
              </div>
            </div>
            <div className="preview-cart">
              <img src="/images/ui-icons/cart.png" alt="Корзина" className="cart-icon" />
              <span className="cart-count">0</span>
            </div>
          </div>
        </header>

        {/* Categories */}
        <div className="preview-categories">
          <div className="preview-category">
            <img src="/images/category-icons/implants-icon.png" alt="" className="cat-icon-img" />
            <div className="cat-name">Имплантаты</div>
          </div>
          <div className="preview-category">
            <img src="/images/category-icons/components-icon.png" alt="" className="cat-icon-img" />
            <div className="cat-name">Компоненты</div>
          </div>
          <div className="preview-category">
            <img src="/images/category-icons/bone-materials-icon.png" alt="" className="cat-icon-img" />
            <div className="cat-name">Костные материалы</div>
          </div>
          <div className="preview-category">
            <img src="/images/category-icons/membranes-icon.png" alt="" className="cat-icon-img" />
            <div className="cat-name">Мембраны</div>
          </div>
          <div className="preview-category">
            <img src="/images/category-icons/supplies-icon.png" alt="" className="cat-icon-img" />
            <div className="cat-name">Расходники</div>
          </div>
        </div>

        {/* InfoBar */}
        <div className="preview-infobar">
          <div className="education-block">
            <img src="/images/ui-icons/education.png" alt="" className="ui-icon-sm" />
            <span>Обучение и вебинары</span>
            <img src="/images/ui-icons/dropdown.png" alt="" className="dropdown-icon-dark" />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="preview-disclaimer">
          <div className="disclaimer-title-new">© 2013-2025 ООО «DUTYSTOM». Все права защищены.</div>
          <div className="disclaimer-text-new">
            Обращаем Ваше внимание на то, что данный Сайт носит исключительно информационный характер...
          </div>
        </div>

        {/* Products */}
        <div className="preview-products">
          <h2 className="section-title-new">Популярные товары</h2>

          <div className="products-grid">
            <div className="preview-product-card">
              <div className="product-image-new">
                <img src="/images/products/dio-uf-ii-hsa.png" alt="DIO UF II HSA" />
              </div>
              <div className="product-info-new">
                <span className="product-brand-new">DIO</span>
                <span className="product-article-new">DIO-001</span>
                <span className="product-name-new">DIO UF II HSA</span>
              </div>
              <span className="product-stock-new">В наличии</span>
              <div className="product-bottom-new">
                <span className="product-price-new">2 500 ₽</span>
                <div className="product-actions-new">
                  <div className="qty-controls-new">
                    <button>−</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                  <button className="add-to-cart-new">
                    <img src="/images/ui-icons/cart.png" alt="" className="cart-icon-sm" />
                    В корзину
                  </button>
                </div>
              </div>
            </div>

            <div className="preview-product-card">
              <div className="product-image-new">
                <img src="/images/products/dio-short-hsa.png" alt="DIO Short HSA" />
              </div>
              <div className="product-info-new">
                <span className="product-brand-new">DIO</span>
                <span className="product-article-new">DIO-002</span>
                <span className="product-name-new">DIO Short HSA</span>
              </div>
              <span className="product-stock-new">В наличии</span>
              <div className="product-bottom-new">
                <span className="product-price-new">3 000 ₽</span>
                <div className="product-actions-new">
                  <div className="qty-controls-new">
                    <button>−</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                  <button className="add-to-cart-new">
                    <img src="/images/ui-icons/cart.png" alt="" className="cart-icon-sm" />
                    В корзину
                  </button>
                </div>
              </div>
            </div>

            <div className="preview-product-card">
              <div className="product-image-new">
                <img src="/images/products/sportsman-sbl-5.png" alt="Sportsman SBL 5.0" />
              </div>
              <div className="product-info-new">
                <span className="product-brand-new">SBL</span>
                <span className="product-article-new">SBL-5001</span>
                <span className="product-name-new">Sportsman SBL 5.0</span>
              </div>
              <span className="product-stock-new">В наличии</span>
              <div className="product-bottom-new">
                <span className="product-price-new">4 500 ₽</span>
                <div className="product-actions-new">
                  <div className="qty-controls-new">
                    <button>−</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                  <button className="add-to-cart-new">
                    <img src="/images/ui-icons/cart.png" alt="" className="cart-icon-sm" />
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="preview-footer">
          <div className="footer-content-new">
            <div className="footer-logo-new">
              <img src="/images/logo.png" alt="DUTYSTOM" className="footer-logo-img" />
            </div>
            <div className="footer-contacts-new">
              <p><img src="/images/ui-icons/phone.png" alt="" className="footer-icon" /> +7 930-950-88-87</p>
              <p><img src="/images/ui-icons/email.png" alt="" className="footer-icon" /> info@dutystom.ru</p>
            </div>
            <div className="footer-social-new">
              <a href="#"><img src="/images/ui-icons/telegram.png" alt="Telegram" className="footer-social-icon" /></a>
              <a href="#"><img src="/images/ui-icons/whatsapp.png" alt="WhatsApp" className="footer-social-icon" /></a>
              <a href="#"><img src="/images/ui-icons/vk.png" alt="VK" className="footer-social-icon" /></a>
              <a href="#"><img src="/images/ui-icons/youtube.png" alt="YouTube" className="footer-social-icon" /></a>
            </div>
            <p className="footer-copyright-new">© 2025 DUTYSTOM - Стоматологическое оборудование</p>
          </div>
        </footer>
      </div>

      {/* Палитра цветов */}
      <div className="color-palette">
        <h3>Палитра цветов</h3>
        <div className="palette-row">
          <div className="color-swatch" style={{background: '#3d9b9b'}}>
            <span>#3d9b9b</span>
            <small>Основной (Teal)</small>
          </div>
          <div className="color-swatch" style={{background: '#2d7a7a'}}>
            <span>#2d7a7a</span>
            <small>Тёмный</small>
          </div>
          <div className="color-swatch" style={{background: '#d4c4b0'}}>
            <span>#d4c4b0</span>
            <small>Бежевый</small>
          </div>
          <div className="color-swatch" style={{background: '#c9b99a', color: '#333'}}>
            <span>#c9b99a</span>
            <small>Тёмный беж (фон)</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorSchemeDemo
