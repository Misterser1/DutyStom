import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'

const categories = [
  { id: 1, name: 'Имплантаты', slug: 'implantaty' },
  { id: 2, name: 'Компоненты', slug: 'komponenty' },
  { id: 3, name: 'Костные материалы', slug: 'kostnye-materialy' },
  { id: 4, name: 'Мембраны', slug: 'membrany' },
  { id: 5, name: 'Расходники', slug: 'raskhodniki' }
]

const emptyProduct = {
  code: '',
  article: '',
  name: '',
  name_en: '',
  description: '',
  description_en: '',
  brand: '',
  country: '',
  price: '',
  category_id: 1,
  category: 'Имплантаты',
  image_url: '',
  specs: {}
}

function ProductsEditor() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useAdmin()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState(emptyProduct)

  // Фильтрация товаров
  const filteredProducts = products.filter(p => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.code?.includes(search)

    const matchesCategory = !filterCategory ||
      p.category_id === parseInt(filterCategory)

    return matchesSearch && matchesCategory
  })

  const handleEdit = (product) => {
    setEditingProduct(product.id)
    setFormData({ ...product })
    setIsAdding(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingProduct(null)
    setFormData({ ...emptyProduct, code: String(products.length + 1).padStart(5, '0') })
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setIsAdding(false)
    setFormData(emptyProduct)
  }

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }

      // Обновляем название категории при изменении category_id
      if (field === 'category_id') {
        const cat = categories.find(c => c.id === parseInt(value))
        if (cat) {
          updated.category = cat.name
        }
      }

      return updated
    })
  }

  const handleSave = () => {
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      category_id: parseInt(formData.category_id)
    }

    if (isAdding) {
      addProduct(productData)
    } else if (editingProduct) {
      updateProduct(editingProduct, productData)
    }

    handleCancel()
  }

  const handleDelete = (id) => {
    if (window.confirm('Удалить этот товар?')) {
      deleteProduct(id)
    }
  }

  const handleReset = () => {
    if (window.confirm('Сбросить все товары к начальным данным? Все изменения будут потеряны!')) {
      resetProducts()
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  return (
    <div className="products-editor">
      <div className="editor-header">
        <h2>Управление товарами</h2>
        <p>Всего товаров: {products.length}</p>
      </div>

      {/* Панель инструментов */}
      <div className="products-toolbar">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Поиск по названию, бренду, коду..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="category-filter"
        >
          <option value="">Все категории</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button onClick={handleAdd} className="add-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Добавить товар
        </button>

        <button onClick={handleReset} className="reset-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Сбросить
        </button>
      </div>

      {/* Форма добавления/редактирования */}
      {(isAdding || editingProduct) && (
        <div className="product-form-overlay">
          <div className="product-form">
            <div className="form-header">
              <h3>{isAdding ? 'Добавить товар' : 'Редактировать товар'}</h3>
              <button onClick={handleCancel} className="close-btn">&times;</button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Код товара</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Артикул</label>
                <input
                  type="text"
                  value={formData.article || ''}
                  onChange={(e) => handleChange('article', e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label>Название товара (RU) *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  placeholder="Название на русском"
                />
              </div>

              <div className="form-group full-width">
                <label>Название товара (EN)</label>
                <input
                  type="text"
                  value={formData.name_en || ''}
                  onChange={(e) => handleChange('name_en', e.target.value)}
                  placeholder="Product name in English"
                />
              </div>

              <div className="form-group">
                <label>Бренд</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Страна</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Цена (руб) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Категория</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleChange('category_id', e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>URL изображения</label>
                <input
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group full-width">
                <label>Описание (RU)</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Описание товара на русском"
                  rows={3}
                />
              </div>

              <div className="form-group full-width">
                <label>Описание (EN)</label>
                <textarea
                  value={formData.description_en || ''}
                  onChange={(e) => handleChange('description_en', e.target.value)}
                  placeholder="Product description in English"
                  rows={3}
                />
              </div>
            </div>

            <div className="form-actions">
              <button onClick={handleSave} className="save-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                {isAdding ? 'Добавить' : 'Сохранить'}
              </button>
              <button onClick={handleCancel} className="cancel-btn">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Список товаров */}
      <div className="products-list">
        <div className="products-table-header">
          <span className="col-code">Код</span>
          <span className="col-name">Название</span>
          <span className="col-brand">Бренд</span>
          <span className="col-category">Категория</span>
          <span className="col-price">Цена</span>
          <span className="col-actions">Действия</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>Товары не найдены</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-row">
              <span className="col-code">{product.code}</span>
              <span className="col-name">{product.name}</span>
              <span className="col-brand">{product.brand}</span>
              <span className="col-category">{product.category}</span>
              <span className="col-price">${formatPrice(product.price)}</span>
              <span className="col-actions">
                <button onClick={() => handleEdit(product)} className="edit-btn" title="Редактировать">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button onClick={() => handleDelete(product.id)} className="delete-btn" title="Удалить">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      <div className="products-footer">
        <p>Показано: {filteredProducts.length} из {products.length}</p>
      </div>
    </div>
  )
}

export default ProductsEditor
