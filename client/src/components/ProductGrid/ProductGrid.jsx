import ProductCard from '../ProductCard/ProductCard'
import './ProductGrid.css'

function ProductGrid({ products, title, showUSD = false }) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <h2>Товары не найдены</h2>
        <p>В этой категории пока нет товаров</p>
      </div>
    )
  }

  return (
    <div className="product-grid-wrapper">
      {title && <h2 className="grid-title">{title}</h2>}
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} showUSD={showUSD} />
        ))}
      </div>
    </div>
  )
}

export default ProductGrid
