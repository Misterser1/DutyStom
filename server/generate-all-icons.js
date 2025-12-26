import 'dotenv/config'
import Replicate from 'replicate'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

const IMAGES_DIR = join(__dirname, '../client/public/images/category-icons')

// 9 категорий с промптами для белых иконок
const categories = [
  {
    slug: 'implants',
    name: 'Имплантаты',
    prompt: 'Simple white dental implant icon, solid white silhouette of tooth with screw implant, flat design, minimalist medical icon, pure white color on transparent background, clean vector style, no shadows, no gradients, simple shape'
  },
  {
    slug: 'other',
    name: 'Прочее',
    prompt: 'Simple white medical supplies icon, solid white silhouette of medical box or package, flat design, minimalist icon, pure white color on transparent background, clean vector style, no shadows, no gradients'
  },
  {
    slug: 'prosthetics',
    name: 'Протетика',
    prompt: 'Simple white dental crown icon, solid white silhouette of tooth crown prosthetic, flat design, minimalist dental icon, pure white color on transparent background, clean vector style, no shadows, no gradients'
  },
  {
    slug: 'tools',
    name: 'Инструменты',
    prompt: 'Simple white dental tools icon, solid white silhouette of crossed dental mirror and probe instruments, flat design, minimalist medical icon, pure white color on transparent background, clean vector style, no shadows'
  },
  {
    slug: 'kits',
    name: 'Хирургические наборы',
    prompt: 'Simple white surgical kit icon, solid white silhouette of medical case or surgical instrument set, flat design, minimalist icon, pure white color on transparent background, clean vector style, no shadows'
  },
  {
    slug: 'bone',
    name: 'Костные материалы',
    prompt: 'Simple white bone graft icon, solid white silhouette of medical vial or bone material container, flat design, minimalist medical icon, pure white color on transparent background, clean vector style, no shadows'
  },
  {
    slug: 'membrane',
    name: 'Мембраны',
    prompt: 'Simple white dental membrane icon, solid white silhouette of layered membrane sheet, flat design, minimalist medical icon, pure white color on transparent background, clean vector style, no shadows, no gradients'
  },
  {
    slug: 'pins-gbr',
    name: 'Пины и GBR',
    prompt: 'Simple white dental pins icon, solid white silhouette of medical pins or screws, flat design, minimalist icon, pure white color on transparent background, clean vector style, no shadows, no gradients'
  },
  {
    slug: 'supplies',
    name: 'Расходники',
    prompt: 'Simple white dental supplies icon, solid white silhouette of suture thread or medical consumables, flat design, minimalist icon, pure white color on transparent background, clean vector style, no shadows'
  }
]

async function generateIcon(category) {
  console.log(`\n🎨 Generating: ${category.name} (${category.slug})`)

  try {
    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: category.prompt,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'png',
          output_quality: 90
        }
      }
    )

    if (output && output.length > 0) {
      const imageUrl = output[0]

      // Скачиваем
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Сохраняем
      const filename = `${category.slug}-icon.png`
      const filepath = join(IMAGES_DIR, filename)
      await writeFile(filepath, buffer)

      console.log(`   ✅ Saved: ${filename}`)
      return { success: true, slug: category.slug, path: filepath }
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`)
    return { success: false, slug: category.slug, error: error.message }
  }
}

async function main() {
  console.log('🚀 Generating 9 white category icons')
  console.log(`   Token: ${process.env.REPLICATE_API_TOKEN?.substring(0, 10)}...`)

  // Создаем папку
  if (!existsSync(IMAGES_DIR)) {
    await mkdir(IMAGES_DIR, { recursive: true })
    console.log(`📁 Created directory: ${IMAGES_DIR}`)
  }

  const results = []

  for (const category of categories) {
    const result = await generateIcon(category)
    results.push(result)
  }

  console.log('\n📊 Results:')
  console.log('='.repeat(50))
  results.forEach(r => {
    if (r.success) {
      console.log(`✅ ${r.slug}`)
    } else {
      console.log(`❌ ${r.slug}: ${r.error}`)
    }
  })

  const successful = results.filter(r => r.success).length
  console.log(`\n🎯 Generated ${successful}/${categories.length} icons`)
  console.log(`📂 Location: client/public/images/category-icons/`)
}

main().catch(console.error)
