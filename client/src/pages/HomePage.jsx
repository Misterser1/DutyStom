import { useState, useEffect } from 'react'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import { useLanguage } from '../contexts/LanguageContext'
import { products as allProducts } from '../data/products'
import './HomePage.css'

function HomePage() {
  const { language, t } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загрузка товаров с API или используем локальные данные
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          // Используем локальные данные из Excel
          setProducts(allProducts)
        }
      } catch (error) {
        console.log('Using local data from Excel')
        setProducts(allProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>
  }

  // Группируем товары по категориям для главной
  const implants = products.filter(p => p.category_id === 1).slice(0, 6)
  const boneProducts = products.filter(p => p.category_id === 3).slice(0, 4)
  const membranes = products.filter(p => p.category_id === 4).slice(0, 4)

  return (
    <div className="home-page">
      {implants.length > 0 && (
        <ProductGrid products={implants} title={language === 'en' ? 'Implants' : 'Имплантаты'} />
      )}

      {boneProducts.length > 0 && (
        <ProductGrid products={boneProducts} title={language === 'en' ? 'Bone Materials' : 'Костные материалы'} />
      )}

      {membranes.length > 0 && (
        <ProductGrid products={membranes} title={language === 'en' ? 'Membranes' : 'Мембраны'} />
      )}
    </div>
  )
}

export default HomePage
