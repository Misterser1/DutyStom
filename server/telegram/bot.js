import TelegramBot from 'node-telegram-bot-api'
import { dbAll, dbGet, dbRun } from '../database/init.js'

let bot = null
let adminChatId = null

// Хранение связи message_id -> session_id для ответов через Reply
const messageToSession = new Map()

// Инициализация бота
export function initTelegramBot(token) {
  if (!token) {
    console.log('Telegram bot token not provided, bot disabled')
    return null
  }

  try {
    bot = new TelegramBot(token, { polling: true })
    console.log('Telegram bot initialized')

    // Загружаем admin chat id из настроек
    const setting = dbGet("SELECT value FROM telegram_settings WHERE key = 'admin_chat_id'")
    if (setting) {
      adminChatId = parseInt(setting.value)
    }

    // Обработка команды /start
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id
      bot.sendMessage(chatId,
        '👋 Добро пожаловать в DUTYSTOM Support Bot!\n\n' +
        'Команды:\n' +
        '/register - Зарегистрировать этот чат как админский\n' +
        '/status - Проверить статус бота\n' +
        '/chats - Список активных чатов\n\n' +
        '💡 Для ответа клиенту просто ответьте (Reply) на его сообщение!'
      )
    })

    // Регистрация админа
    bot.onText(/\/register/, (msg) => {
      const chatId = msg.chat.id

      dbRun(
        "INSERT OR REPLACE INTO telegram_settings (key, value) VALUES ('admin_chat_id', ?)",
        [String(chatId)]
      )
      adminChatId = chatId

      bot.sendMessage(chatId,
        '✅ Этот чат зарегистрирован как админский!\n\n' +
        'Теперь вы будете получать уведомления о новых сообщениях от клиентов.\n\n' +
        '💡 Для ответа просто ответьте (Reply) на сообщение клиента!'
      )
    })

    // Проверка статуса
    bot.onText(/\/status/, (msg) => {
      const chatId = msg.chat.id
      const isAdmin = chatId === adminChatId

      bot.sendMessage(chatId,
        `📊 Статус бота:\n\n` +
        `Бот активен: ✅\n` +
        `Админ чат: ${isAdmin ? '✅ Это админский чат' : '❌ Не админский чат'}\n` +
        `Admin Chat ID: ${adminChatId || 'Не установлен'}`
      )
    })

    // Список активных чатов
    bot.onText(/\/chats/, (msg) => {
      const chatId = msg.chat.id

      if (chatId !== adminChatId) {
        bot.sendMessage(chatId, '❌ Только админ может просматривать чаты')
        return
      }

      const chats = dbAll(`
        SELECT c.*,
          (SELECT COUNT(*) FROM chat_messages WHERE chat_id = c.id) as message_count,
          (SELECT message FROM chat_messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
        FROM chats c
        WHERE c.status = 'active'
        ORDER BY c.updated_at DESC
        LIMIT 10
      `)

      if (chats.length === 0) {
        bot.sendMessage(chatId, '📭 Нет активных чатов')
        return
      }

      let text = '📬 Активные чаты:\n\n'
      chats.forEach((chat, i) => {
        text += `${i + 1}. ${chat.client_name || 'Гость'}\n`
        text += `   Сообщений: ${chat.message_count}\n`
        text += `   Последнее: ${chat.last_message?.substring(0, 50) || '-'}...\n\n`
      })

      bot.sendMessage(chatId, text)
    })

    // Обработка ВСЕХ сообщений (для Reply)
    bot.on('message', (msg) => {
      const chatId = msg.chat.id

      // Только для админа
      if (chatId !== adminChatId) return

      // Игнорируем команды
      if (msg.text?.startsWith('/')) return

      // Проверяем, это ответ на сообщение?
      if (msg.reply_to_message) {
        const replyToId = msg.reply_to_message.message_id
        const sessionId = messageToSession.get(replyToId)

        if (sessionId) {
          // Найти чат по session_id
          const chat = dbGet('SELECT * FROM chats WHERE session_id = ?', [sessionId])

          if (chat) {
            // Сохранить ответ в базу
            dbRun(
              'INSERT INTO chat_messages (chat_id, sender, message) VALUES (?, ?, ?)',
              [chat.id, 'admin', msg.text]
            )

            // Обновить время чата
            dbRun('UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [chat.id])

            bot.sendMessage(chatId, `✅ Ответ отправлен клиенту "${chat.client_name || 'Гость'}"`, {
              reply_to_message_id: msg.message_id
            })
          } else {
            bot.sendMessage(chatId, '❌ Чат не найден', {
              reply_to_message_id: msg.message_id
            })
          }
        }
      }
    })

    return bot
  } catch (error) {
    console.error('Failed to initialize Telegram bot:', error)
    return null
  }
}

// Отправить уведомление админу о новом сообщении
export function notifyAdmin(sessionId, clientName, message) {
  if (!bot || !adminChatId) {
    console.log('Bot or admin chat not configured, skipping notification')
    return false
  }

  const text =
    `💬 Новое сообщение!\n\n` +
    `👤 Клиент: ${clientName || 'Гость'}\n` +
    `📝 ${message}`

  // Отправляем и сохраняем message_id для Reply
  bot.sendMessage(adminChatId, text).then((sentMsg) => {
    messageToSession.set(sentMsg.message_id, sessionId)

    // Очищаем старые записи (храним только последние 1000)
    if (messageToSession.size > 1000) {
      const keys = Array.from(messageToSession.keys())
      for (let i = 0; i < 100; i++) {
        messageToSession.delete(keys[i])
      }
    }
  })

  return true
}

// Отправить уведомление о новом заказе
export function notifyNewOrder(order) {
  if (!bot || !adminChatId) {
    return false
  }

  const text =
    `🛒 Новый заказ #${order.id}!\n\n` +
    `👤 Клиент: ${order.customer_name}\n` +
    `📞 Телефон: ${order.customer_phone}\n` +
    `📧 Email: ${order.customer_email}\n` +
    `💰 Сумма: ${order.total} ₽\n\n` +
    `Товары:\n${order.items}`

  bot.sendMessage(adminChatId, text)
  return true
}

export function getBot() {
  return bot
}

export function getAdminChatId() {
  return adminChatId
}
