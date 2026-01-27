import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CartProvider } from './context/CartContext'
import { AdminProvider } from './context/AdminContext'
import { LanguageProvider } from './contexts/LanguageContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AdminProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AdminProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
)
