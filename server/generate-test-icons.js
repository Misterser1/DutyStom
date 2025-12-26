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

const IMAGES_DIR = join(__dirname, '../client/public/images/test-icons')

// 5 разных стилей для иконки "Имплантаты"
const styles = [
  {
    name: 'style1-minimal-lines',
    prompt: 'Minimalist dental implant icon, thin white outline on transparent background, single line art style, simple elegant medical icon, vector-like, clean design, no background, PNG with transparency'
  },
  {
    name: 'style2-3d-realistic',
    prompt: 'Photorealistic 3D dental implant icon, titanium metallic screw, high detail, soft studio lighting, floating on transparent background, medical equipment render, professional product visualization'
  },
  {
    name: 'style3-flat-colored',
    prompt: 'Flat design dental implant icon, Material Design style, solid teal color #3d9b9b, simple geometric shapes, modern app icon, clean edges, no gradients, minimalist medical icon'
  },
  {
    name: 'style4-gradient-glossy',
    prompt: 'Modern glossy dental implant icon, gradient from teal to dark teal, glass-like shine effect, 3D depth, subtle reflection, premium app icon style, medical technology aesthetic'
  },
  {
    name: 'style5-isometric',
    prompt: 'Isometric dental implant icon, 3D isometric view, soft pastel colors, clean geometric design, medical illustration style, light shadows, modern infographic icon'
  }
]

async function generateIcon(style) {
  console.log(`\n🎨 Generating: ${style.name}`)
  console.log(`   Prompt: ${style.prompt.substring(0, 80)}...`)

  try {
    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: style.prompt,
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
      const filename = `implants-${style.name}.png`
      const filepath = join(IMAGES_DIR, filename)
      await writeFile(filepath, buffer)

      console.log(`   ✅ Saved: ${filename}`)
      return { success: true, name: style.name, path: filepath }
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`)
    return { success: false, name: style.name, error: error.message }
  }
}

async function main() {
  console.log('🚀 Starting icon generation test (5 styles for "Имплантаты")')
  console.log(`   Token: ${process.env.REPLICATE_API_TOKEN?.substring(0, 10)}...`)

  // Создаем папку
  if (!existsSync(IMAGES_DIR)) {
    await mkdir(IMAGES_DIR, { recursive: true })
    console.log(`📁 Created directory: ${IMAGES_DIR}`)
  }

  const results = []

  for (const style of styles) {
    const result = await generateIcon(style)
    results.push(result)
  }

  console.log('\n📊 Results:')
  console.log('=' .repeat(50))
  results.forEach(r => {
    if (r.success) {
      console.log(`✅ ${r.name}`)
    } else {
      console.log(`❌ ${r.name}: ${r.error}`)
    }
  })

  const successful = results.filter(r => r.success).length
  console.log(`\n🎯 Generated ${successful}/${styles.length} icons`)
  console.log(`📂 Location: client/public/images/test-icons/`)
}

main().catch(console.error)
