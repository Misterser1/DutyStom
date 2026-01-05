import { useState, useEffect } from 'react'

const ICON_OPTIONS = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'vk', label: 'ВКонтакте' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'odnoklassniki', label: 'Одноклассники' },
  { value: 'dzen', label: 'Дзен' }
]

function SocialLinksEditor() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    icon: 'telegram',
    url: '',
    sort_order: 0,
    is_active: true
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/settings/social/all')
      const data = await res.json()
      setLinks(data)
    } catch (error) {
      console.error('Error fetching social links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await fetch(`/api/settings/social/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        await fetch('/api/settings/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      fetchLinks()
      resetForm()
      showSaved()
    } catch (error) {
      console.error('Error saving social link:', error)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      icon: item.icon,
      url: item.url,
      sort_order: item.sort_order || 0,
      is_active: item.is_active === 1
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить эту ссылку?')) return
    try {
      await fetch(`/api/settings/social/${id}`, { method: 'DELETE' })
      fetchLinks()
      showSaved()
    } catch (error) {
      console.error('Error deleting social link:', error)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name: '',
      icon: 'telegram',
      url: '',
      sort_order: 0,
      is_active: true
    })
  }

  const showSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const getIconSvg = (icon) => {
    const icons = {
      telegram: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>,
      whatsapp: <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.31a8.188 8.188 0 01-1.26-4.38c.01-4.54 3.7-8.25 8.25-8.25zM8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01z"/>,
      vk: <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.08 14.27h-1.46c-.55 0-.72-.43-1.71-1.43-0.87-.83-1.22-.94-1.43-.94-.29 0-.37.08-.37.48v1.31c0 .34-.11.55-1.01.55-1.49 0-3.15-.9-4.31-2.59-1.75-2.47-2.23-4.31-2.23-4.69 0-.21.08-.4.48-.4h1.46c.36 0 .49.16.63.53.69 2 1.85 3.75 2.33 3.75.18 0 .26-.08.26-.53v-2.06c-.05-.94-.55-1.02-.55-1.36 0-.17.14-.33.36-.33h2.29c.31 0 .42.16.42.51v2.78c0 .31.14.42.23.42.18 0 .33-.11.67-.45 1.03-1.16 1.77-2.94 1.77-2.94.1-.21.26-.4.62-.4h1.46c.44 0 .54.23.44.51-.19.87-2.03 3.47-2.03 3.47-.16.26-.22.37 0 .66.16.21.69.66 1.04 1.07.65.73 1.14 1.34 1.27 1.77.14.42-.09.64-.52.64z"/>,
      youtube: <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>,
      instagram: <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 011.25 1.25A1.25 1.25 0 0117.25 8 1.25 1.25 0 0116 6.75a1.25 1.25 0 011.25-1.25M12 7a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5m0 2a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3z"/>,
      facebook: <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06 2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>,
      tiktok: <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0115.54 3h-3.09v12.4a2.592 2.592 0 01-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 004.3 1.38V7.3s-1.88.09-3.24-1.48z"/>,
      twitter: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>,
      odnoklassniki: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm5.5 10.7c-.5.5-1.4.9-2.3 1.1.9.2 1.8.6 2.3 1.1.6.5.6 1.4.1 2-.5.6-1.4.6-2 .1-.9-.8-2.2-1.3-3.6-1.3s-2.7.5-3.6 1.3c-.6.5-1.5.5-2-.1-.5-.6-.5-1.5.1-2 .5-.5 1.4-.9 2.3-1.1-.9-.2-1.8-.6-2.3-1.1-.6-.5-.6-1.4-.1-2 .5-.6 1.4-.6 2-.1.9.8 2.2 1.3 3.6 1.3s2.7-.5 3.6-1.3c.6-.5 1.5-.5 2 .1.5.6.5 1.5-.1 2z"/>,
      dzen: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
    }
    return icons[icon] || icons.telegram
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="social-links-editor">
      <div className="editor-header">
        <h2>Управление соцсетями</h2>
        <p>Добавляйте ссылки на социальные сети, которые отображаются в футере и хедере сайта</p>
      </div>

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-section">
          <h3>{editingId ? 'Редактирование' : 'Добавить соцсеть'}</h3>

          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Telegram"
              required
            />
          </div>

          <div className="form-group">
            <label>Иконка *</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            >
              {ICON_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ссылка *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://t.me/username"
              required
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
        <h3>Социальные сети ({links.length})</h3>
        {links.length === 0 ? (
          <p className="empty-message">Ссылок пока нет</p>
        ) : (
          <div className="items-table">
            {links.map(item => (
              <div key={item.id} className={`item-row ${!item.is_active ? 'inactive' : ''}`}>
                <div className="item-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    {getIconSvg(item.icon)}
                  </svg>
                </div>
                <div className="item-info">
                  <strong>{item.name}</strong>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
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

export default SocialLinksEditor
