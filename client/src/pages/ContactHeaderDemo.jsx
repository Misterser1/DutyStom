import { useState } from 'react'
import './ContactHeaderDemo.css'

const phone = '+7 930-950-88-87'
const email = 'info@dutystom.ru'

function ContactHeaderDemo() {
  const [copiedText, setCopiedText] = useState('')

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(''), 2000)
  }

  return (
    <div className="contact-header-demo">
      <h1>Варианты отображения контактов в Header</h1>
      <p className="demo-description">
        Телефон и email с иконкой копирования (десктоп).<br/>
        В мобильной версии - только иконки трубки и почты.
      </p>

      {/* Вариант 1: Inline текст */}
      <div className="demo-section">
        <h2>Вариант 1: Inline текст</h2>
        <p>Контакты в одну строку, компактно</p>
        <div className="header-mock">
          <div className="header-mock-content">
            <div className="logo-placeholder">DUTYSTOM</div>
            <div className="search-placeholder">Поиск...</div>

            <div className="contacts-v1">
              <div className="contact-item-v1" onClick={() => copyToClipboard(phone)}>
                <span className="contact-text">{phone}</span>
                <button className="copy-btn-mini" title="Копировать">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </button>
              </div>
              <span className="contact-divider-v1">|</span>
              <div className="contact-item-v1" onClick={() => copyToClipboard(email)}>
                <span className="contact-text">{email}</span>
                <button className="copy-btn-mini" title="Копировать">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="social-placeholder">Мы в соцсетях ▼</div>
            <div className="cart-placeholder">🛒</div>
          </div>
        </div>
      </div>

      {/* Вариант 2: С иконками слева */}
      <div className="demo-section">
        <h2>Вариант 2: С иконками слева</h2>
        <p>Иконка типа контакта + текст + копирование</p>
        <div className="header-mock">
          <div className="header-mock-content">
            <div className="logo-placeholder">DUTYSTOM</div>
            <div className="search-placeholder">Поиск...</div>

            <div className="contacts-v2">
              <div className="contact-item-v2" onClick={() => copyToClipboard(phone)}>
                <svg className="contact-icon-v2" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span className="contact-text-v2">{phone}</span>
                <button className="copy-btn-v2" title="Копировать">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </button>
              </div>
              <div className="contact-item-v2" onClick={() => copyToClipboard(email)}>
                <svg className="contact-icon-v2" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span className="contact-text-v2">{email}</span>
                <button className="copy-btn-v2" title="Копировать">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="social-placeholder">Мы в соцсетях ▼</div>
            <div className="cart-placeholder">🛒</div>
          </div>
        </div>
      </div>

      {/* Вариант 3: Вертикальный компактный */}
      <div className="demo-section">
        <h2>Вариант 3: Вертикальный компактный</h2>
        <p>Контакты друг под другом, экономия места</p>
        <div className="header-mock">
          <div className="header-mock-content">
            <div className="logo-placeholder">DUTYSTOM</div>
            <div className="search-placeholder">Поиск...</div>

            <div className="contacts-v3">
              <div className="contact-item-v3" onClick={() => copyToClipboard(phone)}>
                <span className="contact-text-v3">{phone}</span>
                <svg className="copy-icon-v3" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </div>
              <div className="contact-item-v3" onClick={() => copyToClipboard(email)}>
                <span className="contact-text-v3">{email}</span>
                <svg className="copy-icon-v3" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </div>
            </div>

            <div className="social-placeholder">Мы в соцсетях ▼</div>
            <div className="cart-placeholder">🛒</div>
          </div>
        </div>
      </div>

      {/* Вариант 4: Chips/Badges */}
      <div className="demo-section">
        <h2>Вариант 4: Badges</h2>
        <p>Контакты в виде бейджей с фоном</p>
        <div className="header-mock">
          <div className="header-mock-content">
            <div className="logo-placeholder">DUTYSTOM</div>
            <div className="search-placeholder">Поиск...</div>

            <div className="contacts-v4">
              <div className="contact-badge-v4" onClick={() => copyToClipboard(phone)}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>{phone}</span>
                <svg className="copy-icon-v4" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </div>
              <div className="contact-badge-v4" onClick={() => copyToClipboard(email)}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>{email}</span>
                <svg className="copy-icon-v4" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </div>
            </div>

            <div className="social-placeholder">Мы в соцсетях ▼</div>
            <div className="cart-placeholder">🛒</div>
          </div>
        </div>
      </div>

      {/* Вариант 5: Минималистичный */}
      <div className="demo-section">
        <h2>Вариант 5: Минималистичный</h2>
        <p>Только текст, при наведении появляется копирование</p>
        <div className="header-mock">
          <div className="header-mock-content">
            <div className="logo-placeholder">DUTYSTOM</div>
            <div className="search-placeholder">Поиск...</div>

            <div className="contacts-v5">
              <div className="contact-item-v5" onClick={() => copyToClipboard(phone)}>
                <span>{phone}</span>
                <span className="copy-hint-v5">📋</span>
              </div>
              <span className="dot-v5">•</span>
              <div className="contact-item-v5" onClick={() => copyToClipboard(email)}>
                <span>{email}</span>
                <span className="copy-hint-v5">📋</span>
              </div>
            </div>

            <div className="social-placeholder">Мы в соцсетях ▼</div>
            <div className="cart-placeholder">🛒</div>
          </div>
        </div>
      </div>

      {/* Уведомление о копировании */}
      {copiedText && (
        <div className="copy-notification">
          Скопировано: {copiedText}
        </div>
      )}
    </div>
  )
}

export default ContactHeaderDemo
