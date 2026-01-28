import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import './ChatWidget.css'

// Генерация уникального ID сессии
const getSessionId = () => {
  let sessionId = localStorage.getItem('chat_session_id')
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('chat_session_id', sessionId)
  }
  return sessionId
}

function ChatWidget() {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [userName, setUserName] = useState('')
  const [isNameSet, setIsNameSet] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const messagesEndRef = useRef(null)
  const sessionId = useRef(getSessionId())

  // Автопрокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Сброс индикатора новых сообщений при открытии
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false)
    }
  }, [isOpen])

  // Ref для отслеживания последнего ID сообщения
  const lastMessageIdRef = useRef(0)

  // Long polling для получения новых сообщений
  useEffect(() => {
    if (!isNameSet) return

    const pollMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/chat/messages/${sessionId.current}/new?after=${lastMessageIdRef.current}`
        )

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.messages.length > 0) {
            // Фильтруем только сообщения от админа (от клиента уже добавлены локально)
            const adminMessages = data.messages.filter(m => m.sender === 'admin')
            if (adminMessages.length > 0) {
              const formattedMessages = adminMessages.map(m => ({
                id: m.id,
                from: 'manager',
                text: m.message,
                timestamp: new Date(m.created_at).getTime()
              }))
              setMessages(prev => [...prev, ...formattedMessages])
              if (!isOpen) {
                setHasNewMessage(true)
              }
            }
            // Обновляем lastMessageId
            const maxId = Math.max(...data.messages.map(m => m.id))
            if (maxId > lastMessageIdRef.current) {
              lastMessageIdRef.current = maxId
            }
          }
        }
      } catch (error) {
        console.log('Polling error:', error)
      }
    }

    const interval = setInterval(pollMessages, 3000)
    return () => clearInterval(interval)
  }, [isNameSet, isOpen])

  // Отправка сообщения
  const sendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isSending) return

    const message = inputValue.trim()
    setInputValue('')
    setIsSending(true)

    // Добавляем сообщение локально
    const newMessage = {
      from: 'client',
      text: message,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, newMessage])

    try {
      const response = await fetch('http://localhost:5001/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId.current,
          message,
          clientName: userName
        })
      })
      const data = await response.json()
      if (data.success) {
        // Обновляем lastMessageId если сервер вернул id
        if (data.messageId && data.messageId > lastMessageIdRef.current) {
          lastMessageIdRef.current = data.messageId
        }
      }
    } catch (error) {
      console.error('Send error:', error)
    } finally {
      setIsSending(false)
    }
  }

  // Начать чат (ввод имени)
  const startChat = async (e) => {
    e.preventDefault()
    if (userName.trim()) {
      // Регистрируем/обновляем сессию на сервере
      try {
        await fetch(`http://localhost:5001/api/chat/session/${sessionId.current}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientName: userName.trim() })
        })
      } catch (error) {
        console.log('Session update error:', error)
      }

      setIsNameSet(true)
      // Приветственное сообщение
      const welcomeText = language === 'en'
        ? `Hello, ${userName}! How can I help you?`
        : `Здравствуйте, ${userName}! Чем могу помочь?`
      setMessages([{
        from: 'manager',
        text: welcomeText,
        timestamp: Date.now()
      }])
    }
  }

  return (
    <div className="chat-widget">
      {/* Кнопка чата */}
      <button
        className={`chat-toggle-btn ${isOpen ? 'open' : ''} ${hasNewMessage ? 'has-notification' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Открыть чат"
      >
        {isOpen ? (
          // Иконка закрытия
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          // Иконка Telegram
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.504-1.36 8.629-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        )}
        {hasNewMessage && <span className="notification-dot"></span>}
      </button>

      {/* Окно чата */}
      {isOpen && (
        <div className="chat-window">
          {/* Шапка */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.504-1.36 8.629-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div className="chat-header-text">
                <h4>DUTYSTOM Support</h4>
                <span className="chat-status">
                  <span className="status-dot"></span>
                  {language === 'en' ? 'Online' : 'Онлайн'}
                </span>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          {/* Тело чата */}
          <div className="chat-body">
            {!isNameSet ? (
              // Форма ввода имени
              <div className="chat-intro">
                <div className="intro-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.504-1.36 8.629-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <h3>{language === 'en' ? 'Welcome!' : 'Добро пожаловать!'}</h3>
                <p>{language === 'en' ? 'We are available on Telegram. Introduce yourself and we will start a conversation.' : 'Мы на связи в Telegram. Представьтесь, и мы начнём диалог.'}</p>
                <form onSubmit={startChat} className="name-form">
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Your name' : 'Ваше имя'}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" disabled={!userName.trim()}>
                    {language === 'en' ? 'Start chat' : 'Начать чат'}
                  </button>
                </form>
              </div>
            ) : (
              // Список сообщений
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`chat-message ${msg.from === 'client' ? 'from-client' : 'from-manager'}`}
                  >
                    <div className="message-bubble">
                      {msg.text}
                    </div>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Форма отправки */}
          {isNameSet && (
            <form className="chat-input-form" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder={language === 'en' ? 'Enter message...' : 'Введите сообщение...'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isSending}
              />
              <button type="submit" disabled={!inputValue.trim() || isSending}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatWidget
