import { useState, useEffect } from 'react'

function EducationEditor() {
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    sort_order: 0,
    is_active: true
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const res = await fetch('/api/settings/education/all')
      const data = await res.json()
      setEducation(data)
    } catch (error) {
      console.error('Error fetching education:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await fetch(`/api/settings/education/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        await fetch('/api/settings/education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      fetchEducation()
      resetForm()
      showSaved()
    } catch (error) {
      console.error('Error saving education:', error)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      description: item.description || '',
      link: item.link || '',
      sort_order: item.sort_order || 0,
      is_active: item.is_active === 1
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот материал?')) return
    try {
      await fetch(`/api/settings/education/${id}`, { method: 'DELETE' })
      fetchEducation()
      showSaved()
    } catch (error) {
      console.error('Error deleting education:', error)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      link: '',
      sort_order: 0,
      is_active: true
    })
  }

  const showSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="education-editor">
      <div className="editor-header">
        <h2>Управление обучением</h2>
        <p>Добавляйте материалы для обучения, которые отображаются при клике на иконку "Обучение"</p>
      </div>

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-section">
          <h3>{editingId ? 'Редактирование' : 'Добавить материал'}</h3>

          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Название курса или материала"
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Краткое описание материала"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Ссылка</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://example.com/course"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Порядок сортировки</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                Активен
              </label>
            </div>
          </div>
        </div>

        <div className="editor-actions">
          <button type="submit" className="save-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            {editingId ? 'Обновить' : 'Добавить'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="reset-btn">
              Отмена
            </button>
          )}
          {saved && <span className="save-message">Сохранено!</span>}
        </div>
      </form>

      <div className="items-list">
        <h3>Список материалов ({education.length})</h3>
        {education.length === 0 ? (
          <p className="empty-message">Материалов пока нет</p>
        ) : (
          <div className="items-table">
            {education.map(item => (
              <div key={item.id} className={`item-row ${!item.is_active ? 'inactive' : ''}`}>
                <div className="item-info">
                  <strong>{item.title}</strong>
                  {item.description && <p>{item.description}</p>}
                  {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a>}
                </div>
                <div className="item-meta">
                  <span className={`status ${item.is_active ? 'active' : 'inactive'}`}>
                    {item.is_active ? 'Активен' : 'Скрыт'}
                  </span>
                  <span className="order">#{item.sort_order}</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEdit(item)} className="edit-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="delete-btn">
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
    </div>
  )
}

export default EducationEditor
