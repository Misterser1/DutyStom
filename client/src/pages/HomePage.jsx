import { useState, useEffect } from 'react'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import './HomePage.css'

// Демо-данные товаров (будут заменены на API)
const demoProducts = [
  { id: 1, name: 'Blue Diamond Regular Thread', brand: 'MEGAGEN', category_id: 1, price: 13500, image_url: null },
  { id: 2, name: 'Blue Diamond Deep Thread', brand: 'MEGAGEN', category_id: 1, price: 13500, image_url: null },
  { id: 3, name: 'AnyOne Regular Thread', brand: 'MEGAGEN', category_id: 1, price: 6600, image_url: null },
  { id: 4, name: 'AnyOne Deep Thread', brand: 'MEGAGEN', category_id: 1, price: 6600, image_url: null },
  { id: 5, name: 'SimpleLine II', brand: 'DENTIUM', category_id: 1, price: 12350, image_url: null },
  { id: 6, name: 'INNO Submerged', brand: 'CWM', category_id: 1, price: 7500, image_url: null },
  { id: 7, name: 'DIO Implant UFII', brand: 'DIO', category_id: 1, price: 5950, image_url: null },
  { id: 8, name: 'OSSTEM TS IV BA', brand: 'OSSTEM', category_id: 1, price: 9000, image_url: null },
  { id: 9, name: 'Straumann Bone Level', brand: 'Straumann', category_id: 1, price: 18400, image_url: null },
  { id: 10, name: 'Astra Tech TX', brand: 'ASTRA TECH', category_id: 1, price: 19900, image_url: null },
  { id: 11, name: 'Healing Abutment', brand: 'Universal', category_id: 2, price: 600, image_url: null },
  { id: 12, name: 'Analog', brand: 'Universal', category_id: 2, price: 800, image_url: null },
  { id: 13, name: 'Transfer', brand: 'Universal', category_id: 2, price: 850, image_url: null },
  { id: 14, name: 'Abutment Cemented', brand: 'Universal', category_id: 2, price: 800, image_url: null },
  { id: 15, name: 'Titan B Xenograft 0.25g', brand: 'TITAN', category_id: 3, price: 7700, image_url: null },
  { id: 16, name: 'InterOss Xenograft 0.5cc', brand: 'SIGMAGRAFT', category_id: 3, price: 6500, image_url: null },
  { id: 17, name: 'Cerabone 2ml', brand: 'Straumann', category_id: 3, price: 13500, image_url: null },
  { id: 18, name: 'Creos Xenogain 0.25g', brand: 'Nobel', category_id: 3, price: 7200, image_url: null },
  { id: 19, name: 'Titan-Gide Membrane 15x20mm', brand: 'TITAN', category_id: 4, price: 6000, image_url: null },
  { id: 20, name: 'Jason Membrane 15x20mm', brand: 'Straumann', category_id: 4, price: 10000, image_url: null },
  { id: 21, name: 'InterCollagen Guide 15x20mm', brand: 'SIGMAGRAFT', category_id: 4, price: 11000, image_url: null },
  { id: 22, name: 'PTFE Membrane PM2025A', brand: 'Universal', category_id: 4, price: 8000, image_url: null },
  { id: 23, name: 'Dafilon Suture 4/0', brand: 'B.BRAUN', category_id: 5, price: 10000, image_url: null },
  { id: 24, name: 'GC Fuji I Cement', brand: 'GC', category_id: 5, price: 6000, image_url: null },
  { id: 25, name: 'Single Bond Universal', brand: '3M', category_id: 5, price: 5500, image_url: null },
  { id: 26, name: 'Bone Scraper Titan S', brand: 'TITAN', category_id: 5, price: 4000, image_url: null },
]

function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загрузка товаров с API (пока демо-данные)
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          // Используем демо-данные
          setProducts(demoProducts)
        }
      } catch (error) {
        console.log('Using demo data')
        setProducts(demoProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div className="loading"></div>
  }

  // Группируем товары по категориям для главной
  const popularProducts = products.slice(0, 8)
  const implants = products.filter(p => p.category_id === 1).slice(0, 4)

  return (
    <div className="home-page">
      <ProductGrid products={popularProducts} title="Популярные товары" />

      {implants.length > 0 && (
        <ProductGrid products={implants} title="Имплантаты" />
      )}
    </div>
  )
}

export default HomePage
