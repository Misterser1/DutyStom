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

// Промпты по типу категории
const categoryPrompts = {
  // Протетика
  protetika: 'dental prosthetic component, abutment, titanium dental part',
  // Инструменты
  instrumenty: 'dental surgical instrument, medical steel tool, professional dental equipment',
  // Хирургические наборы
  'hirurgicheskie-nabory': 'dental surgical kit, complete medical instrument set, sterile packaging',
  // Костные материалы
  'kostnye-materialy': 'bone graft material, xenograft granules in medical vial, dental bone substitute',
  // Мембраны
  membrany: 'collagen membrane, dental barrier membrane, surgical membrane',
  // Пины и GBR
  'piny-i-gbr': 'dental pins and screws, GBR fixation system, titanium bone screws',
  // Расходники
  rashodniki: 'dental consumables, medical sutures, surgical supplies',
  // Прочее
  prochee: 'dental medical equipment, professional dental product'
}

// Стиль 1: Фотореалистичный
function getPrompt(productName, productBrand, categorySlug) {
  const categoryDesc = categoryPrompts[categorySlug] || 'dental medical product'
  return `Professional product photography of ${productName} by ${productBrand || 'premium brand'}, ${categoryDesc}, high detail medical equipment, clean white background, studio lighting, 8k quality, photorealistic, commercial product shot, small watermark text "DUTYSTOM" in corner`
}

async function generateImage(product, categorySlug) {
  const prompt = getPrompt(product.name, product.brand, categorySlug)
  const filename = `product-${product.id}.png`
  const filepath = join(IMAGES_DIR, filename)

  console.log(`\n🎨 [${product.id}] ${product.name}`)
  console.log(`   Brand: ${product.brand || 'N/A'} | Category: ${categorySlug}`)

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
  console.log('🚀 Generating images for ALL products without images')
  console.log(`   Token: ${process.env.REPLICATE_API_TOKEN?.substring(0, 10)}...`)

  // Создаем папку
  if (!existsSync(IMAGES_DIR)) {
    await mkdir(IMAGES_DIR, { recursive: true })
    console.log(`📁 Created directory: ${IMAGES_DIR}`)
  }

  // Инициализируем БД
  await initDatabase()

  // Получаем ВСЕ товары без изображений с информацией о категории
  const products = dbAll(`
    SELECT p.id, p.name, p.brand, p.category_id, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.image_url IS NULL OR p.image_url = ''
    ORDER BY p.category_id, p.id
  `)

  console.log(`📦 Found ${products.length} products without images`)

  // Группируем по категориям для отображения
  const byCategory = {}
  for (const p of products) {
    const cat = p.category_slug || 'unknown'
    byCategory[cat] = (byCategory[cat] || 0) + 1
  }
  console.log('\n📊 By category:')
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`   ${cat}: ${count}`)
  }
  console.log('')

  let success = 0
  let failed = 0

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    console.log(`\n[${i + 1}/${products.length}]`)

    const imageUrl = await generateImage(product, product.category_slug)

    if (imageUrl) {
      dbRun('UPDATE products SET image_url = ? WHERE id = ?', [imageUrl, product.id])
      success++
    } else {
      failed++
    }

    // Пауза между запросами
    await new Promise(r => setTimeout(r, 300))
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 FINAL RESULTS:')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${success}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📂 Location: client/public/images/products/`)
}

main().catch(console.error)
