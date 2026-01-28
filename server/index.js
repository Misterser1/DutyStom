import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Загружаем .env из папки сервера
dotenv.config({ path: join(__dirname, '.env') })

import productsRouter from './routes/products.js'
import categoriesRouter from './routes/categories.js'
import ordersRouter from './routes/orders.js'
import generateRouter from './routes/generate.js'
import importRouter from './routes/import.js'
import settingsRouter from './routes/settings.js'
import chatRouter from './routes/chat.js'
import { initDatabase } from './database/init.js'
import { initTelegramBot } from './telegram/bot.js'

const app = express()
const PORT = 5001

// Middleware
app.use(cors())
app.use(express.json())

// Статические файлы для изображений
app.use('/images', express.static(join(__dirname, '../client/public/images')))

// API Routes
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/generate', generateRouter)
app.use('/api/import', importRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/chat', chatRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Инициализация БД и запуск сервера
async function start() {
  try {
    await initDatabase()
    console.log('Database initialized')

    // Инициализация Telegram бота
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN
    if (telegramToken) {
      initTelegramBot(telegramToken)
    } else {
      console.log('TELEGRAM_BOT_TOKEN not set, Telegram bot disabled')
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
