import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import CategoryBar from './components/CategoryBar/CategoryBar'
import InfoBar from './components/InfoBar/InfoBar'
import Disclaimer from './components/Disclaimer/Disclaimer'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
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
import AdminPage from './pages/Admin/AdminPage'
import './styles/App.css'

function App() {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'

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
      <Disclaimer />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
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
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/images/logo-dutystom.png" alt="DUTYSTOM" />
            <span>DUTYSTOM</span>
          </div>
          <div className="footer-contacts">
            <p>Телефон: +7 930-950-88-87</p>
            <p>Email: info@dutystom.ru</p>
            <p>Время работы: Пн-Пт 9:00 - 18:00</p>
          </div>
          <p className="footer-copyright">&copy; 2025 DUTYSTOM - Стоматологическое оборудование</p>
        </div>
      </footer>
    </div>
  )
}

export default App
