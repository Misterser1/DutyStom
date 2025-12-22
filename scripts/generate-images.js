/**
 * Скрипт для генерации изображений товаров через Replicate API
 * Запуск: node scripts/generate-images.js [category]
 *
 * Примеры:
 *   node scripts/generate-images.js logo        - генерация логотипа
 *   node scripts/generate-images.js icons       - генерация иконок категорий
 *   node scripts/generate-images.js implants    - генерация изображений имплантатов
 *   node scripts/generate-images.js all         - генерация всех изображений
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Загружаем .env из папки server
dotenv.config({ path: join(__dirname, '../server/.env') })

const API_URL = 'http://localhost:5000/api'

async function generateLogo() {
  console.log('Generating logo...')
  try {
    const response = await fetch(`${API_URL}/generate/logo`, { method: 'POST' })
    const data = await response.json()
    console.log('Logo generated:', data)
    return data
  } catch (error) {
    console.error('Error generating logo:', error.message)
  }
}

async function generateCategoryIcons() {
  console.log('Generating category icons...')
  try {
    const response = await fetch(`${API_URL}/generate/category-icons`, { method: 'POST' })
    const data = await response.json()
    console.log('Icons generated:', data)
    return data
  } catch (error) {
    console.error('Error generating icons:', error.message)
  }
}

async function generateCategoryImages(slug) {
  console.log(`Generating images for category: ${slug}...`)
  try {
    const response = await fetch(`${API_URL}/generate/category/${slug}`, { method: 'POST' })
    const data = await response.json()
    console.log(`Category ${slug} images generated:`, data)
    return data
  } catch (error) {
    console.error(`Error generating images for ${slug}:`, error.message)
  }
}

async function generateAll() {
  console.log('Starting full image generation...')

  // Генерируем логотип
  await generateLogo()
  await sleep(2000)

  // Генерируем иконки категорий
  await generateCategoryIcons()
  await sleep(2000)

  // Генерируем изображения для каждой категории
  const categories = ['implants', 'components', 'bone', 'membrane', 'supplies']

  for (const category of categories) {
    await generateCategoryImages(category)
    await sleep(5000) // Пауза между категориями
  }

  console.log('All images generated!')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Обработка аргументов командной строки
const args = process.argv.slice(2)
const command = args[0] || 'help'

switch (command) {
  case 'logo':
    generateLogo()
    break
  case 'icons':
    generateCategoryIcons()
    break
  case 'implants':
  case 'components':
  case 'bone':
  case 'membrane':
  case 'supplies':
    generateCategoryImages(command)
    break
  case 'all':
    generateAll()
    break
  default:
    console.log(`
DUTYSTOM Image Generator

Usage: node scripts/generate-images.js [command]

Commands:
  logo        - Generate logo using nano-banana-pro
  icons       - Generate category icons
  implants    - Generate images for implants category
  components  - Generate images for components category
  bone        - Generate images for bone materials category
  membrane    - Generate images for membranes category
  supplies    - Generate images for supplies category
  all         - Generate all images (logo, icons, all categories)

Note: Make sure the server is running (npm run dev) before generating images.
    `)
}
