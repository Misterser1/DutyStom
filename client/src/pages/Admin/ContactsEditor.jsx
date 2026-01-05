import { useState, useEffect } from 'react'

function ContactsEditor() {
  const [contacts, setContacts] = useState({
    phone: '',
    email: '',
    address: '',
    workHours: ''
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/settings/contacts')
      const data = await res.json()
      setContacts({
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        workHours: data.workHours || ''
      })
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setContacts(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    try {
      await fetch('/api/settings/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contacts)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving contacts:', error)
    }
  }

  const handleReset = async () => {
    if (window.confirm('Сбросить контакты к начальным значениям?')) {
      const defaults = {
        phone: '+7 930-950-88-87',
        email: 'info@dutystom.ru',
        address: 'г. Москва, ул. Примерная, д. 1',
        workHours: 'Пн-Пт 9:00 - 18:00'
      }
      try {
        await fetch('/api/settings/contacts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(defaults)
        })
        setContacts(defaults)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } catch (error) {
        console.error('Error resetting contacts:', error)
      }
    }
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="contacts-editor">
      <div className="editor-header">
        <h2>Редактирование контактов</h2>
        <p>Измените контактную информацию, которая отображается на всём сайте (хедер, футер и т.д.)</p>
      </div>

      <div className="editor-form">
        <div className="form-section">
          <h3>Основные контакты</h3>

          <div className="form-group">
            <label>Телефон</label>
            <input
              type="text"
              value={contacts.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+7 XXX-XXX-XX-XX"
            />
            <small>Отображается в хедере и футере</small>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={contacts.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@example.com"
            />
            <small>Отображается в хедере и футере</small>
          </div>

          <div className="form-group">
            <label>Адрес</label>
            <input
              type="text"
              value={contacts.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="г. Город, ул. Улица, д. X"
            />
            <small>Отображается в футере</small>
          </div>

          <div className="form-group">
            <label>Время работы</label>
            <input
              type="text"
              value={contacts.workHours}
              onChange={(e) => handleChange('workHours', e.target.value)}
              placeholder="Пн-Пт 9:00 - 18:00"
            />
            <small>Отображается в футере</small>
          </div>
        </div>

        <div className="info-box">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <p>Все изменения автоматически синхронизируются по всему сайту. После сохранения обновите страницу для просмотра изменений.</p>
        </div>
      </div>

      <div className="editor-actions">
        <button onClick={handleSave} className="save-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
          </svg>
          Сохранить
        </button>
        <button onClick={handleReset} className="reset-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Сбросить
        </button>
        {saved && <span className="save-message">Сохранено!</span>}
      </div>
    </div>
  )
}

export default ContactsEditor
