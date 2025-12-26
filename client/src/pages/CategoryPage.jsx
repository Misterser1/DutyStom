import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import './CategoryPage.css'

function CategoryPage() {
  const { slug } = useParams()
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setSelectedSubcategory(null)
      setSelectedBrand(null)

      try {
        // Загружаем категорию, подкатегории и товары параллельно
        const [categoryRes, subcategoriesRes, productsRes] = await Promise.all([
          fetch(`/api/categories/${slug}`),
          fetch(`/api/categories/${slug}/subcategories`),
          fetch(`/api/products?category=${slug}`)
        ])

        if (categoryRes.ok) {
          const categoryData = await categoryRes.json()
          setCategory(categoryData)
        }

        if (subcategoriesRes.ok) {
          const subcategoriesData = await subcategoriesRes.json()
          setSubcategories(subcategoriesData)
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setAllProducts(productsData)
          setFilteredProducts(productsData)

          // Извлекаем уникальные бренды с количеством товаров
          const brandCounts = {}
          productsData.forEach(p => {
            if (p.brand) {
              brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1
            }
          })
          const uniqueBrands = Object.entries(brandCounts).map(([brand, count]) => ({
            name: brand,
            count
          }))
          setBrands(uniqueBrands.sort((a, b) => a.name.localeCompare(b.name)))
        }
      } catch (error) {
        console.error('Error fetching category data:', error)
      }

      setLoading(false)
    }

    fetchData()
  }, [slug])

  // Фильтрация товаров при выборе подкатегории или бренда
  useEffect(() => {
    let filtered = allProducts

    // Фильтр по подкатегории
    if (selectedSubcategory) {
      filtered = filtered.filter(p => p.category_slug === selectedSubcategory)
    }

    // Фильтр по бренду
    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand)
    }

    setFilteredProducts(filtered)

    // Обновляем счётчики брендов при выборе подкатегории
    if (selectedSubcategory) {
      const brandCounts = {}
      filtered.forEach(p => {
        if (p.brand) {
          brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1
        }
      })
      const updatedBrands = Object.entries(brandCounts).map(([brand, count]) => ({
        name: brand,
        count
      }))
      setBrands(updatedBrands.sort((a, b) => a.name.localeCompare(b.name)))
    }
  }, [selectedSubcategory, selectedBrand, allProducts])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="category-page">
      <h1 className="category-title">{category?.name || 'Товары'}</h1>

      {/* Подкатегории как кнопки фильтров */}
      {subcategories.length > 0 && (
        <div className="subcategories-bar">
          <button
            onClick={() => {
              setSelectedSubcategory(null)
              setSelectedBrand(null)
            }}
            className={`subcategory-btn ${!selectedSubcategory ? 'active' : ''}`}
          >
            All ({allProducts.length})
          </button>

          {subcategories.map(sub => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubcategory(sub.slug)
                setSelectedBrand(null)
              }}
              className={`subcategory-btn ${selectedSubcategory === sub.slug ? 'active' : ''}`}
            >
              {sub.name} ({sub.product_count})
            </button>
          ))}
        </div>
      )}

      {/* Фильтр по брендам */}
      {brands.length > 1 && (
        <div className="brands-bar">
          <div className="filter-label">Brand:</div>
          <button
            onClick={() => setSelectedBrand(null)}
            className={`brand-btn ${!selectedBrand ? 'active' : ''}`}
          >
            All
          </button>

          {brands.map(brand => (
            <button
              key={brand.name}
              onClick={() => setSelectedBrand(brand.name)}
              className={`brand-btn ${selectedBrand === brand.name ? 'active' : ''}`}
            >
              {brand.name} ({brand.count})
            </button>
          ))}
        </div>
      )}

      {/* Список товаров */}
      <ProductGrid products={filteredProducts} />
    </div>
  )
}

export default CategoryPage
