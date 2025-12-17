import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import CategoryBar from './components/CategoryBar/CategoryBar'
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
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <CategoryBar />
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
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 DUTYSTOM - Стоматологическое оборудование</p>
          <p>Телефон: +7 930-950-88-87</p>
        </div>
      </footer>
    </div>
  )
}

export default App
