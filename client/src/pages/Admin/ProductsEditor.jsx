import { useState, useEffect, useRef } from 'react'

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
  price_usd: '',
  category_id: null,
  image_url: '',
  in_stock: true,
  specs: '',
  material: ''
}

function ProductsEditor() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterCategoryName, setFilterCategoryName] = useState('Все категории')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [expandedFilters, setExpandedFilters] = useState(new Set())
  const filterRef = useRef(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState(emptyProduct)
  const [error, setError] = useState('')

  // Загрузка товаров и категорий
  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories/all/tree')
      ])

      if (!productsRes.ok) throw new Error('Failed to fetch products')
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories')

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Переключение развёрнутости категории в фильтре
  const toggleFilterExpand = (categoryId, e) => {
    e.stopPropagation()
    setExpandedFilters(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  // Выбор категории в фильтре
  const selectFilterCategory = (id, name) => {
    setFilterCategory(id ? String(id) : '')
    setFilterCategoryName(name)
    setIsFilterOpen(false)
  }

  // Получить плоский список категорий для селекта (с группировкой)
  const getCategoryOptions = () => {
    const options = []
    categories.forEach(parent => {
      options.push({
        id: parent.id,
        name: parent.name,
        isParent: true
      })
      if (parent.subcategories?.length > 0) {
        parent.subcategories.forEach(sub => {
          options.push({
            id: sub.id,
            name: `  └ ${sub.name}`,
            isParent: false,
            parentId: parent.id
          })
        })
      }
    })
    return options
  }

  // Получить название категории по id
  const getCategoryName = (categoryId) => {
    for (const parent of categories) {
      if (parent.id === categoryId) return parent.name
      const sub = parent.subcategories?.find(s => s.id === categoryId)
      if (sub) return `${parent.name} → ${sub.name}`
    }
    return '—'
  }

  // Получить все ID категорий для фильтра (включая подкатегории)
  const getCategoryIdsForFilter = (categoryId) => {
    const id = parseInt(categoryId)
    const ids = [id]

    // Найти родительскую категорию и добавить все её подкатегории
    const parent = categories.find(c => c.id === id)
    if (parent?.subcategories) {
      parent.subcategories.forEach(sub => ids.push(sub.id))
    }

    return ids
  }

  // Фильтрация товаров
  const filteredProducts = products.filter(p => {
    const matchesSearch = !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.code?.includes(search) ||
      p.article?.includes(search)

    let matchesCategory = true
    if (filterCategory) {
      const allowedIds = getCategoryIdsForFilter(filterCategory)
      matchesCategory = allowedIds.includes(p.category_id)
    }

    return matchesSearch && matchesCategory
  })

  const handleEdit = (product) => {
    setEditingProduct(product.id)
    setFormData({
      ...product,
      price: product.price || '',
      price_usd: product.price_usd || '',
      specs: product.specs || '',
      material: product.material || ''
    })
    setIsAdding(false)
    setError('')
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingProduct(null)
    setFormData({ ...emptyProduct })
    setError('')
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setIsAdding(false)
    setFormData(emptyProduct)
    setError('')
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      setError('Название обязательно')
      return
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        price_usd: formData.price_usd ? parseFloat(formData.price_usd) : null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        in_stock: formData.in_stock ? 1 : 0
      }

      if (isAdding) {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to create product')
        }
      } else if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to update product')
        }
      }

      handleCancel()
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот товар?')) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete product')
      }
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const formatPrice = (price) => {
    if (!price) return '—'
    return new Intl.NumberFormat('ru-RU').format(price)
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  const categoryOptions = getCategoryOptions()

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

        <div className="category-filter-dropdown" ref={filterRef}>
          <button
            className="category-filter-btn"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span>{filterCategoryName}</span>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>

          {isFilterOpen && (
            <div className="category-filter-menu">
              <div
                className={`filter-option ${!filterCategory ? 'active' : ''}`}
                onClick={() => selectFilterCategory('', 'Все категории')}
              >
                Все категории
              </div>

              {categories.map(parent => (
                <div key={parent.id} className="filter-category-group">
                  <div className="filter-parent-row">
                    {parent.subcategories?.length > 0 && (
                      <button
                        className="filter-expand-btn"
                        onClick={(e) => toggleFilterExpand(parent.id, e)}
                      >
                        {expandedFilters.has(parent.id) ? '▼' : '▶'}
                      </button>
                    )}
                    <div
                      className={`filter-option filter-parent ${filterCategory === String(parent.id) ? 'active' : ''}`}
                      onClick={() => selectFilterCategory(parent.id, parent.name)}
                    >
                      {parent.name}
                      <span className="filter-count">{parent.product_count}</span>
                    </div>
                  </div>

                  {expandedFilters.has(parent.id) && parent.subcategories?.map(sub => (
                    <div
                      key={sub.id}
                      className={`filter-option filter-sub ${filterCategory === String(sub.id) ? 'active' : ''}`}
                      onClick={() => selectFilterCategory(sub.id, `${parent.name} → ${sub.name}`)}
                    >
                      └ {sub.name}
                      <span className="filter-count">{sub.product_count}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleAdd} className="add-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Добавить товар
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

            {error && <div className="form-error">{error}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label>Код товара</label>
                <input
                  type="text"
                  value={formData.code || ''}
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
                  value={formData.name || ''}
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
                  value={formData.brand || ''}
                  onChange={(e) => handleChange('brand', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Страна</label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => handleChange('country', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Цена (руб)</label>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => handleChange('price', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Цена (USD)</label>
                <input
                  type="number"
                  value={formData.price_usd || ''}
                  onChange={(e) => handleChange('price_usd', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Категория</label>
                <select
                  value={formData.category_id || ''}
                  onChange={(e) => handleChange('category_id', e.target.value)}
                >
                  <option value="">— Без категории —</option>
                  {categoryOptions.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>В наличии</label>
                <select
                  value={formData.in_stock ? '1' : '0'}
                  onChange={(e) => handleChange('in_stock', e.target.value === '1')}
                >
                  <option value="1">Да</option>
                  <option value="0">Нет</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>URL изображения</label>
                <input
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  placeholder="/images/products/product.jpg"
                />
              </div>

              <div className="form-group full-width">
                <label>Материал</label>
                <input
                  type="text"
                  value={formData.material || ''}
                  onChange={(e) => handleChange('material', e.target.value)}
                  placeholder="Титан, керамика и т.д."
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

              <div className="form-group full-width">
                <label>Характеристики (JSON или текст)</label>
                <textarea
                  value={formData.specs || ''}
                  onChange={(e) => handleChange('specs', e.target.value)}
                  placeholder='{"Диаметр": "3.5 мм", "Длина": "10 мм"}'
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
              <span className="col-code">{product.code || '—'}</span>
              <span className="col-name">{product.name}</span>
              <span className="col-brand">{product.brand || '—'}</span>
              <span className="col-category">{getCategoryName(product.category_id)}</span>
              <span className="col-price">{formatPrice(product.price)} ₽</span>
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
