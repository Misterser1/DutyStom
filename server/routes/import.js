import { Router } from 'express'
import { importFromJSON, previewImport, getImportHistory } from '../services/importService.js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

/**
 * POST /api/import/preview
 * Предварительный просмотр импорта (не изменяет БД)
 */
router.post('/preview', async (req, res) => {
  try {
    const { jsonData } = req.body

    if (!jsonData) {
      return res.status(400).json({ error: 'No JSON data provided' })
    }

    const preview = await previewImport(jsonData)
    res.json(preview)
  } catch (error) {
    console.error('Preview error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/import/execute
 * Выполнение импорта
 */
router.post('/execute', async (req, res) => {
  try {
    const { jsonData, options } = req.body

    if (!jsonData) {
      return res.status(400).json({ error: 'No JSON data provided' })
    }

    const result = await importFromJSON(jsonData, options || {})
    res.json(result)
  } catch (error) {
    console.error('Import error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/import/history
 * История импортов
 */
router.get('/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50
    const history = getImportHistory(limit)
    res.json(history)
  } catch (error) {
    console.error('History error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/import/from-file
 * Импорт из JSON файла (для быстрого тестирования)
 */
router.post('/from-file', async (req, res) => {
  try {
    const { filename, options } = req.body

    // Читаем JSON файл из директории data/
    const dataDir = join(__dirname, '..', '..', 'data')
    const filePath = join(dataDir, filename || 'price-list-2025.json')

    console.log('Reading file:', filePath)
    const fileContent = readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(fileContent)

    const result = await importFromJSON(jsonData, options || {})
    res.json(result)
  } catch (error) {
    console.error('Import from file error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
