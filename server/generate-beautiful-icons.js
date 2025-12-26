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

// 9 категорий с промптами для красивых белых иконок на прозрачном фоне
const categories = [
  {
    slug: 'implants',
    name: 'Имплантаты',
    prompt: 'Minimalist white dental implant icon, simple clean white tooth with titanium screw, flat vector style icon, solid white color, transparent background, medical icon design, clean silhouette, no shadows, white on alpha'
  },
  {
    slug: 'other',
    name: 'Прочее',
    prompt: 'Minimalist white package box icon, simple clean white cardboard box, flat vector style icon, solid white color, transparent background, clean silhouette, no shadows, white on alpha'
  },
  {
    slug: 'prosthetics',
    name: 'Протетика',
    prompt: 'Minimalist white dental crown icon, simple clean white tooth crown, flat vector style icon, solid white color, transparent background, dental prosthetic icon, clean silhouette, no shadows, white on alpha'
  },
  {
    slug: 'tools',
    name: 'Инструменты',
    prompt: 'Minimalist white dental tools icon, simple white dental mirror and explorer probe crossed, flat vector style icon, solid white color, transparent background, clean silhouette, no shadows, white on alpha'
  },
  {
    slug: 'kits',
    name: 'Хирургические наборы',
    prompt: 'Minimalist white medical kit briefcase icon, simple white surgical case with cross, flat vector style icon, solid white color, transparent background, clean silhouette, no shadows, white on alpha'
  },
  {
    slug: 'bone',
    name: 'Костные материалы',
    prompt: 'Minimalist white medical vial bottle icon, simple white laboratory bottle container, flat vector style icon, solid white color, transparent background, clean silhouette, no shadows, white on alpha'
  },
  {
    slug: 'membrane',
    name: 'Мембраны',
    prompt: 'Minimalist white layered sheets icon, simple white stacked membrane layers, flat vector style icon, solid white color, transparent background, clean silhouette, no shadows, white on alpha'
  },
  {
    slug: 'pins-gbr',
    name: 'Пины и GBR',
    prompt: 'Minimalist white medical pins screws icon, simple white three vertical pins, flat vector style icon, solid white color, transparent background, clean silhouette, no shadows, white on alpha'
  },
  {
    slug: 'supplies',
    name: 'Расходники',
    prompt: 'Minimalist white surgical suture thread icon, simple white needle with thread, flat vector style icon, solid white color, transparent background, clean silhouette, no shadows, white on alpha'
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
          output_quality: 95
        }
      }
    )

    if (output && output.length > 0) {
      const imageUrl = output[0]
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const filename = `${category.slug}.png`
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
  console.log('🚀 Generating 9 beautiful category icons via Replicate')

  if (!existsSync(IMAGES_DIR)) {
    await mkdir(IMAGES_DIR, { recursive: true })
  }

  const results = []
  for (const category of categories) {
    const result = await generateIcon(category)
    results.push(result)
  }

  console.log('\n📊 Results:')
  console.log('='.repeat(50))
  const successful = results.filter(r => r.success).length
  console.log(`🎯 Generated ${successful}/${categories.length} icons`)
  console.log(`📂 Location: client/public/images/category-icons/`)
}

main().catch(console.error)
