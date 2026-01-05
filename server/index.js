import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

import productsRouter from './routes/products.js'
import categoriesRouter from './routes/categories.js'
import ordersRouter from './routes/orders.js'
import generateRouter from './routes/generate.js'
import importRouter from './routes/import.js'
import settingsRouter from './routes/settings.js'
import { initDatabase } from './database/init.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Инициализация БД и запуск сервера
async function start() {
  try {
    await initDatabase()
    console.log('Database initialized')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
