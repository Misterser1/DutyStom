import 'dotenv/config'
import Replicate from 'replicate'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initDatabase, dbGet, dbAll, dbRun, saveDb } from './database/init.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

const IMAGES_DIR = join(__dirname, '../client/public/images/products')

// Стиль 1: Фотореалистичный
function getPrompt(productName, productBrand) {
  return `Professional product photography of ${productName} by ${productBrand || 'premium brand'}, dental implant titanium screw with ceramic crown, high detail medical equipment, clean white background, studio lighting, 8k quality, photorealistic, commercial product shot, small watermark text "DUTYSTOM" in corner`
}

async function generateImage(product) {
  const prompt = getPrompt(product.name, product.brand)
  const filename = `product-${product.id}.png`
  const filepath = join(IMAGES_DIR, filename)

  console.log(`\n🎨 Generating: ${product.name}`)
  console.log(`   Brand: ${product.brand || 'N/A'}`)

  try {
    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'png',
          output_quality: 95
        }
      }
    )

    if (output && output.length > 0) {
      const imageUrl = output[0]
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      await writeFile(filepath, buffer)
      console.log(`   ✅ Saved: ${filename}`)
      return `/images/products/${filename}`
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`)
    return null
  }
}

async function main() {
  console.log('🚀 Generating images for IMPLANTATY category')
  console.log(`   Token: ${process.env.REPLICATE_API_TOKEN?.substring(0, 10)}...`)

  // Создаем папку
  if (!existsSync(IMAGES_DIR)) {
    await mkdir(IMAGES_DIR, { recursive: true })
    console.log(`📁 Created directory: ${IMAGES_DIR}`)
  }

  // Инициализируем БД
  await initDatabase()

  // Получаем категорию implantaty и все её подкатегории
  const parentCategory = dbGet("SELECT id FROM categories WHERE slug = 'implantaty'")
  if (!parentCategory) {
    console.error('❌ Category implantaty not found!')
    return
  }

  // Получаем все подкатегории имплантатов
  const subcategories = dbAll('SELECT id, name FROM categories WHERE parent_id = ?', [parentCategory.id])
  const categoryIds = [parentCategory.id, ...subcategories.map(c => c.id)]

  console.log(`📦 Parent ID: ${parentCategory.id}`)
  console.log(`📦 Subcategories: ${subcategories.map(c => c.name).join(', ')}`)

  // Получаем товары категории без изображений
  const products = dbAll(`
    SELECT id, name, brand FROM products
    WHERE category_id IN (${categoryIds.join(',')}) AND (image_url IS NULL OR image_url = '')
  `)

  console.log(`📦 Found ${products.length} products without images`)

  let success = 0
  let failed = 0

  for (const product of products) {
    const imageUrl = await generateImage(product)

    if (imageUrl) {
      // Обновляем БД
      dbRun('UPDATE products SET image_url = ? WHERE id = ?', [imageUrl, product.id])
      success++
    } else {
      failed++
    }

    // Небольшая пауза между запросами
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n📊 Results:')
  console.log('='.repeat(50))
  console.log(`✅ Success: ${success}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📂 Location: client/public/images/products/`)
}

main().catch(console.error)
