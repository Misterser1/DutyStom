import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import { products as allProducts } from '../data/products'

// Маппинг slug категории -> category_id и название
const categoryMap = {
  'implants': { id: 1, name: 'Имплантаты' },
  'components': { id: 2, name: 'Компоненты' },
  'bone': { id: 3, name: 'Костные материалы' },
  'membrane': { id: 4, name: 'Мембраны' },
  'supplies': { id: 5, name: 'Расходники' }
}

function CategoryPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Получаем информацию о категории из маппинга
      const categoryInfo = categoryMap[slug]

      if (categoryInfo) {
        setCategory({ name: categoryInfo.name, slug })

        // Фильтруем локальные данные по category_id
        const filteredProducts = allProducts.filter(p => p.category_id === categoryInfo.id)
        setProducts(filteredProducts)
      } else {
        // Пробуем API если категория не найдена локально
        try {
          const [categoryRes, productsRes] = await Promise.all([
            fetch(`/api/categories/${slug}`),
            fetch(`/api/products?category=${slug}`)
          ])

          if (categoryRes.ok) {
            const categoryData = await categoryRes.json()
            setCategory(categoryData)
          }

          if (productsRes.ok) {
            const productsData = await productsRes.json()
            setProducts(productsData)
          }
        } catch (error) {
          console.error('Error fetching category data:', error)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [slug])

  if (loading) {
    return <div className="loading"></div>
  }

  return (
    <div className="category-page">
      <ProductGrid
        products={products}
        title={category?.name || 'Товары'}
      />
    </div>
  )
}

export default CategoryPage
