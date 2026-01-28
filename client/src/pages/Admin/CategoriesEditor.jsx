import { useState, useEffect } from 'react'

function CategoriesEditor() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [addingSubcategoryTo, setAddingSubcategoryTo] = useState(null)
  const [formData, setFormData] = useState({ name: '', icon_url: '' })
  const [expandedCategories, setExpandedCategories] = useState(new Set())

  // Загрузка категорий
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/categories/all/tree')
      if (!res.ok) throw new Error('Failed to fetch categories')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      setError('Ошибка загрузки категорий')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Развернуть/свернуть категорию
  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  // Открыть форму добавления категории
  const handleAddCategory = () => {
    setIsAdding(true)
    setAddingSubcategoryTo(null)
    setEditingCategory(null)
    setFormData({ name: '', icon_url: '' })
    setError('')
  }

  // Открыть форму добавления подкатегории
  const handleAddSubcategory = (parentId) => {
    setIsAdding(true)
    setAddingSubcategoryTo(parentId)
    setEditingCategory(null)
    setFormData({ name: '', icon_url: '' })
    setError('')
  }

  // Открыть форму редактирования
  const handleEdit = (category) => {
    setEditingCategory(category)
    setIsAdding(false)
    setAddingSubcategoryTo(null)
    setFormData({ name: category.name, icon_url: category.icon_url || '' })
    setError('')
  }

  // Закрыть форму
  const handleCancel = () => {
    setIsAdding(false)
    setEditingCategory(null)
    setAddingSubcategoryTo(null)
    setFormData({ name: '', icon_url: '' })
    setError('')
  }

  // Сохранить категорию
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Название обязательно')
      return
    }

    try {
      if (editingCategory) {
        // Обновление
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to update')
        }
      } else {
        // Создание
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            icon_url: formData.icon_url || null,
            parent_id: addingSubcategoryTo
          })
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to create')
        }
      }

      handleCancel()
      fetchCategories()
    } catch (err) {
      setError(err.message)
    }
  }

  // Удалить категорию
  const handleDelete = async (category) => {
    const message = category.product_count > 0
      ? `Категория "${category.name}" содержит ${category.product_count} товаров. Сначала переместите или удалите товары.`
      : `Удалить категорию "${category.name}"?`

    if (category.product_count > 0) {
      alert(message)
      return
    }

    if (!window.confirm(message)) return

    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      fetchCategories()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="categories-editor">
      <div className="editor-header">
        <h2>Управление категориями</h2>
        <p>Родительских категорий: {categories.length}</p>
      </div>

      {/* Кнопка добавления */}
      <div className="categories-toolbar">
        <button onClick={handleAddCategory} className="add-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Добавить категорию
        </button>
      </div>

      {/* Форма */}
      {(isAdding || editingCategory) && (
        <div className="category-form-card">
          <h3>
            {editingCategory
              ? `Редактирование: ${editingCategory.name}`
              : addingSubcategoryTo
                ? 'Новая подкатегория'
                : 'Новая категория'}
          </h3>

          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Название категории"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>URL иконки</label>
            <input
              type="text"
              value={formData.icon_url}
              onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
              placeholder="/images/icons/category.svg"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">
              {editingCategory ? 'Сохранить' : 'Создать'}
            </button>
            <button onClick={handleCancel} className="cancel-btn">Отмена</button>
          </div>
        </div>
      )}

      {/* Список категорий */}
      <div className="categories-list">
        {categories.map(category => (
          <div key={category.id} className="category-item">
            <div className="category-header">
              <button
                className="expand-btn"
                onClick={() => toggleExpand(category.id)}
                disabled={!category.subcategories?.length}
              >
                {category.subcategories?.length > 0 ? (
                  expandedCategories.has(category.id) ? '▼' : '▶'
                ) : '○'}
              </button>

              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-slug">/{category.slug}</span>
                <span className="category-count">
                  {category.product_count} товаров
                  {category.subcategories?.length > 0 && ` • ${category.subcategories.length} подкат.`}
                </span>
              </div>

              <div className="category-actions">
                <button
                  onClick={() => handleAddSubcategory(category.id)}
                  className="action-btn add-sub-btn"
                  title="Добавить подкатегорию"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleEdit(category)}
                  className="action-btn edit-btn"
                  title="Редактировать"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="action-btn delete-btn"
                  title="Удалить"
                  disabled={category.subcategories?.length > 0}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Подкатегории */}
            {expandedCategories.has(category.id) && category.subcategories?.length > 0 && (
              <div className="subcategories-list">
                {category.subcategories.map(sub => (
                  <div key={sub.id} className="subcategory-item">
                    <div className="subcategory-info">
                      <span className="subcategory-name">{sub.name}</span>
                      <span className="subcategory-slug">/{sub.slug}</span>
                      <span className="subcategory-count">{sub.product_count} товаров</span>
                    </div>

                    <div className="category-actions">
                      <button
                        onClick={() => handleEdit(sub)}
                        className="action-btn edit-btn"
                        title="Редактировать"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(sub)}
                        className="action-btn delete-btn"
                        title="Удалить"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoriesEditor
