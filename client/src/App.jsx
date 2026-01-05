import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import CategoryBar from './components/CategoryBar/CategoryBar'
import InfoBar from './components/InfoBar/InfoBar'
import CategoryBanner from './components/CategoryBanner/CategoryBanner'
import Disclaimer from './components/Disclaimer/Disclaimer'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import SearchPage from './pages/SearchPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LogoDemo from './pages/LogoDemo'
import Logo2Demo from './pages/Logo2Demo'
import LogoSizeDemo from './pages/LogoSizeDemo'
import SocialMediaDemo from './pages/SocialMediaDemo'
import SocialMediaInlineDemo from './pages/SocialMediaInlineDemo'
import SearchDemo from './pages/SearchDemo'
import ContactUsDemo from './pages/ContactUsDemo'
import SocialDropdownDemo from './pages/SocialDropdownDemo'
import CategoryIconDemo from './pages/CategoryIconDemo'
import ProductCardDemo from './pages/ProductCardDemo'
import ProductFontDemo from './pages/ProductFontDemo'
import SiteFontDemo from './pages/SiteFontDemo'
import InfoBarDemo from './pages/InfoBarDemo'
import ProductCardStyleDemo from './pages/ProductCardStyleDemo'
import DropdownStyleDemo from './pages/DropdownStyleDemo'
import ContactHeaderDemo from './pages/ContactHeaderDemo'
import DesignStyleDemo from './pages/DesignStyleDemo'
import HeaderStyleDemo from './pages/HeaderStyleDemo'
import DisclaimerDemo from './pages/DisclaimerDemo'
import ColorSchemeDemo from './pages/ColorSchemeDemo'
import HeaderButtonsDemo from './pages/HeaderButtonsDemo'
import CategoryIconsDemo from './pages/CategoryIconsDemo'
import CategoryDropdownDemo from './pages/CategoryDropdownDemo'
import BackgroundDemo from './pages/BackgroundDemo'
import SpecsStyleDemo from './pages/SpecsStyleDemo'
import CardStyleDemo2 from './pages/CardStyleDemo2'
import CardCompactDemo from './pages/CardCompactDemo'
import CardGradientDemo from './pages/CardGradientDemo'
import AdminPage from './pages/Admin/AdminPage'
import ChatWidget from './components/ChatWidget/ChatWidget'
import Logo from './components/Logo/Logo'
import './styles/App.css'

function App() {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'
  const isHomePage = location.pathname === '/'
  const [copiedItem, setCopiedItem] = useState(null)

  const copyToClipboard = (e, text, itemName) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopiedItem(itemName)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  // Админ-панель - отдельная страница без шапки и футера
  if (isAdminPage) {
    return <AdminPage />
  }

  // Основной сайт с шапкой и футером
  return (
    <div className="app">
      <Header />
      <CategoryBar />
      <InfoBar />
      {isHomePage && <CategoryBanner category="default" />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/logo-demo" element={<LogoDemo />} />
          <Route path="/logo2-demo" element={<Logo2Demo />} />
          <Route path="/logo-size-demo" element={<LogoSizeDemo />} />
          <Route path="/social-media-demo" element={<SocialMediaDemo />} />
          <Route path="/social-inline-demo" element={<SocialMediaInlineDemo />} />
          <Route path="/search-demo" element={<SearchDemo />} />
          <Route path="/contact-us-demo" element={<ContactUsDemo />} />
          <Route path="/social-dropdown-demo" element={<SocialDropdownDemo />} />
          <Route path="/category-icon-demo" element={<CategoryIconDemo />} />
          <Route path="/product-card-demo" element={<ProductCardDemo />} />
          <Route path="/product-font-demo" element={<ProductFontDemo />} />
          <Route path="/site-font-demo" element={<SiteFontDemo />} />
          <Route path="/info-bar-demo" element={<InfoBarDemo />} />
          <Route path="/card-style-demo" element={<ProductCardStyleDemo />} />
          <Route path="/dropdown-style-demo" element={<DropdownStyleDemo />} />
          <Route path="/contact-header-demo" element={<ContactHeaderDemo />} />
          <Route path="/design-demo" element={<DesignStyleDemo />} />
          <Route path="/header-demo" element={<HeaderStyleDemo />} />
          <Route path="/disclaimer-demo" element={<DisclaimerDemo />} />
          <Route path="/color-demo" element={<ColorSchemeDemo />} />
          <Route path="/header-buttons-demo" element={<HeaderButtonsDemo />} />
          <Route path="/category-icons-demo" element={<CategoryIconsDemo />} />
          <Route path="/category-dropdown-demo" element={<CategoryDropdownDemo />} />
          <Route path="/background-demo" element={<BackgroundDemo />} />
          <Route path="/specs-demo" element={<SpecsStyleDemo />} />
          <Route path="/card-demo2" element={<CardStyleDemo2 />} />
          <Route path="/card-compact" element={<CardCompactDemo />} />
          <Route path="/card-gradient-demo" element={<CardGradientDemo />} />
        </Routes>
      </main>
      <Disclaimer />
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Logo size="medium" />
          </div>
          <div className="footer-contacts">
            <a href="tel:+79309508887" className="footer-contact-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span>+7 930-950-88-87</span>
              <button
                className="copy-btn"
                onClick={(e) => copyToClipboard(e, '+7 930-950-88-87', 'phone')}
                title="Копировать"
              >
                {copiedItem === 'phone' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                )}
              </button>
            </a>
            <a href="mailto:info@dutystom.ru" className="footer-contact-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>info@dutystom.ru</span>
              <button
                className="copy-btn"
                onClick={(e) => copyToClipboard(e, 'info@dutystom.ru', 'email')}
                title="Копировать"
              >
                {copiedItem === 'email' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                )}
              </button>
            </a>
            <div className="footer-contact-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <span>Пн-Пт 9:00 - 18:00</span>
            </div>
          </div>
          <p className="footer-copyright">&copy; 2025 DUTYSTOM - Стоматологическое оборудование</p>
        </div>
      </footer>
      <ChatWidget />
    </div>
  )
}

export default App
