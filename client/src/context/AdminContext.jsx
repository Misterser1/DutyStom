import { createContext, useContext, useState, useEffect } from 'react'
import { products as initialProducts } from '../data/products'

const AdminContext = createContext()

const STORAGE_KEYS = {
  contacts: 'dutystom_contacts',
  products: 'dutystom_products',
  auth: 'dutystom_admin_auth'
}

// Начальные данные контактов
const defaultContacts = {
  phone: '+7 930-950-88-87',
  email: 'info@dutystom.ru',
  address: 'г. Москва, ул. Примерная, д. 1',
  workHours: 'Пн-Пт 9:00 - 18:00',
  telegram: 'https://t.me/dutystom',
  whatsapp: 'https://wa.me/79309508887',
  vk: 'https://vk.com/dutystom'
}

// Данные для входа в админку (в реальном проекте хранить на сервере)
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'dutystom2025'

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [contacts, setContacts] = useState(defaultContacts)
  const [products, setProducts] = useState(initialProducts)

  // Загрузка данных при монтировании
  useEffect(() => {
    // Проверка авторизации
    const savedAuth = sessionStorage.getItem(STORAGE_KEYS.auth)
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }

    // Загрузка контактов
    const savedContacts = localStorage.getItem(STORAGE_KEYS.contacts)
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts))
      } catch (e) {
        console.error('Error loading contacts:', e)
      }
    }

    // Загрузка товаров
    const savedProducts = localStorage.getItem(STORAGE_KEYS.products)
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts))
      } catch (e) {
        console.error('Error loading products:', e)
      }
    }
  }, [])

  // Авторизация
  const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem(STORAGE_KEYS.auth, 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem(STORAGE_KEYS.auth)
  }

  // Управление контактами
  const updateContacts = (newContacts) => {
    setContacts(newContacts)
    localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(newContacts))
  }

  // Управление товарами
  const addProduct = (product) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1
    const newProduct = { ...product, id: newId }
    const newProducts = [...products, newProduct]
    setProducts(newProducts)
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(newProducts))
    return newProduct
  }

  const updateProduct = (id, updatedProduct) => {
    const newProducts = products.map(p =>
      p.id === id ? { ...updatedProduct, id } : p
    )
    setProducts(newProducts)
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(newProducts))
  }

  const deleteProduct = (id) => {
    const newProducts = products.filter(p => p.id !== id)
    setProducts(newProducts)
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(newProducts))
  }

  // Сброс к начальным данным
  const resetProducts = () => {
    setProducts(initialProducts)
    localStorage.removeItem(STORAGE_KEYS.products)
  }

  const resetContacts = () => {
    setContacts(defaultContacts)
    localStorage.removeItem(STORAGE_KEYS.contacts)
  }

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        contacts,
        updateContacts,
        resetContacts,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
