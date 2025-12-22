import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'

function ContactsEditor() {
  const { contacts, updateContacts, resetContacts } = useAdmin()
  const [formData, setFormData] = useState(contacts)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setFormData(contacts)
  }, [contacts])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    updateContacts(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    if (window.confirm('Сбросить контакты к начальным значениям?')) {
      resetContacts()
    }
  }

  return (
    <div className="contacts-editor">
      <div className="editor-header">
        <h2>Редактирование контактов</h2>
        <p>Измените контактную информацию, которая отображается на сайте</p>
      </div>

      <div className="editor-form">
        <div className="form-section">
          <h3>Основные контакты</h3>

          <div className="form-group">
            <label>Телефон</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+7 XXX-XXX-XX-XX"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div className="form-group">
            <label>Адрес</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="г. Город, ул. Улица, д. X"
            />
          </div>

          <div className="form-group">
            <label>Время работы</label>
            <input
              type="text"
              value={formData.workHours}
              onChange={(e) => handleChange('workHours', e.target.value)}
              placeholder="Пн-Пт 9:00 - 18:00"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Социальные сети</h3>

          <div className="form-group">
            <label>
              <span className="social-icon">📱</span> Telegram
            </label>
            <input
              type="url"
              value={formData.telegram}
              onChange={(e) => handleChange('telegram', e.target.value)}
              placeholder="https://t.me/username"
            />
          </div>

          <div className="form-group">
            <label>
              <span className="social-icon">💬</span> WhatsApp
            </label>
            <input
              type="url"
              value={formData.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="https://wa.me/7XXXXXXXXXX"
            />
          </div>

          <div className="form-group">
            <label>
              <span className="social-icon">🔵</span> VK
            </label>
            <input
              type="url"
              value={formData.vk}
              onChange={(e) => handleChange('vk', e.target.value)}
              placeholder="https://vk.com/username"
            />
          </div>
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
