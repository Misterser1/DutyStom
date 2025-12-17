import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid/ProductGrid'

function CategoryPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Загружаем категорию и товары параллельно
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
      } finally {
        setLoading(false)
      }
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
