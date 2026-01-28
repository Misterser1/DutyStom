import express from 'express'
import { dbAll, dbGet, dbRun } from '../database/init.js'
import { notifyAdmin } from '../telegram/bot.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// Создать новую сессию чата
router.post('/session', (req, res) => {
  try {
    const { clientName } = req.body
    const sessionId = uuidv4()

    dbRun(
      'INSERT INTO chats (session_id, client_name) VALUES (?, ?)',
      [sessionId, clientName || null]
    )

    res.json({
      success: true,
      sessionId,
      message: 'Chat session created'
    })
  } catch (error) {
    console.error('Error creating chat session:', error)
    res.status(500).json({ error: 'Failed to create chat session' })
  }
})

// Получить или создать сессию по session_id
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params

    let chat = dbGet('SELECT * FROM chats WHERE session_id = ?', [sessionId])

    if (!chat) {
      // Создаем новую сессию
      dbRun(
        'INSERT INTO chats (session_id) VALUES (?)',
        [sessionId]
      )
      chat = dbGet('SELECT * FROM chats WHERE session_id = ?', [sessionId])
    }

    res.json({ success: true, chat })
  } catch (error) {
    console.error('Error getting chat session:', error)
    res.status(500).json({ error: 'Failed to get chat session' })
  }
})

// Обновить имя клиента
router.put('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params
    const { clientName } = req.body

    dbRun(
      'UPDATE chats SET client_name = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?',
      [clientName, sessionId]
    )

    res.json({ success: true, message: 'Client name updated' })
  } catch (error) {
    console.error('Error updating chat session:', error)
    res.status(500).json({ error: 'Failed to update chat session' })
  }
})

// Отправить сообщение от клиента
router.post('/message', (req, res) => {
  try {
    const { sessionId, message, clientName } = req.body

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'sessionId and message are required' })
    }

    // Проверяем/создаем чат
    let chat = dbGet('SELECT * FROM chats WHERE session_id = ?', [sessionId])

    if (!chat) {
      dbRun(
        'INSERT INTO chats (session_id, client_name) VALUES (?, ?)',
        [sessionId, clientName || null]
      )
      chat = dbGet('SELECT * FROM chats WHERE session_id = ?', [sessionId])
    }

    // Сохраняем сообщение
    dbRun(
      'INSERT INTO chat_messages (chat_id, sender, message) VALUES (?, ?, ?)',
      [chat.id, 'client', message]
    )

    // Обновляем время чата
    dbRun('UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [chat.id])

    // Уведомляем админа в Telegram
    notifyAdmin(sessionId, clientName || chat.client_name, message)

    res.json({ success: true, message: 'Message sent' })
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// Получить историю сообщений
router.get('/messages/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params

    const chat = dbGet('SELECT * FROM chats WHERE session_id = ?', [sessionId])

    if (!chat) {
      return res.json({ success: true, messages: [] })
    }

    const messages = dbAll(
      'SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC',
      [chat.id]
    )

    res.json({ success: true, messages })
  } catch (error) {
    console.error('Error getting messages:', error)
    res.status(500).json({ error: 'Failed to get messages' })
  }
})

// Получить новые сообщения (для polling)
router.get('/messages/:sessionId/new', (req, res) => {
  try {
    const { sessionId } = req.params
    const { after } = req.query // timestamp или id последнего сообщения

    const chat = dbGet('SELECT * FROM chats WHERE session_id = ?', [sessionId])

    if (!chat) {
      return res.json({ success: true, messages: [] })
    }

    let messages
    if (after) {
      messages = dbAll(
        'SELECT * FROM chat_messages WHERE chat_id = ? AND id > ? ORDER BY created_at ASC',
        [chat.id, parseInt(after)]
      )
    } else {
      messages = dbAll(
        'SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC',
        [chat.id]
      )
    }

    res.json({ success: true, messages })
  } catch (error) {
    console.error('Error getting new messages:', error)
    res.status(500).json({ error: 'Failed to get new messages' })
  }
})

// Закрыть чат
router.post('/close/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params

    dbRun(
      "UPDATE chats SET status = 'closed', updated_at = CURRENT_TIMESTAMP WHERE session_id = ?",
      [sessionId]
    )

    res.json({ success: true, message: 'Chat closed' })
  } catch (error) {
    console.error('Error closing chat:', error)
    res.status(500).json({ error: 'Failed to close chat' })
  }
})

// === Админские роуты ===

// Получить все активные чаты
router.get('/admin/chats', (req, res) => {
  try {
    const chats = dbAll(`
      SELECT c.*,
        (SELECT COUNT(*) FROM chat_messages WHERE chat_id = c.id) as message_count,
        (SELECT message FROM chat_messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM chat_messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time
      FROM chats c
      WHERE c.status = 'active'
      ORDER BY c.updated_at DESC
    `)

    res.json({ success: true, chats })
  } catch (error) {
    console.error('Error getting admin chats:', error)
    res.status(500).json({ error: 'Failed to get chats' })
  }
})

// Получить все чаты (включая закрытые)
router.get('/admin/chats/all', (req, res) => {
  try {
    const chats = dbAll(`
      SELECT c.*,
        (SELECT COUNT(*) FROM chat_messages WHERE chat_id = c.id) as message_count,
        (SELECT message FROM chat_messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
      FROM chats c
      ORDER BY c.updated_at DESC
    `)

    res.json({ success: true, chats })
  } catch (error) {
    console.error('Error getting all chats:', error)
    res.status(500).json({ error: 'Failed to get chats' })
  }
})

// Отправить сообщение от админа
router.post('/admin/message', (req, res) => {
  try {
    const { sessionId, message } = req.body

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'sessionId and message are required' })
    }

    const chat = dbGet('SELECT * FROM chats WHERE session_id = ?', [sessionId])

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' })
    }

    // Сохраняем сообщение
    dbRun(
      'INSERT INTO chat_messages (chat_id, sender, message) VALUES (?, ?, ?)',
      [chat.id, 'admin', message]
    )

    // Обновляем время чата
    dbRun('UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [chat.id])

    res.json({ success: true, message: 'Message sent' })
  } catch (error) {
    console.error('Error sending admin message:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

export default router
