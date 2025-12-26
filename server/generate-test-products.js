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

const IMAGES_DIR = join(__dirname, '../client/public/images/test-products')

// 5 разных стилей для фото товара (имплантат)
const styles = [
  {
    name: 'style1-photo-realistic',
    description: 'Фотореалистичный на белом фоне',
    prompt: 'Professional product photography of dental implant, titanium screw with ceramic crown, high detail medical equipment, clean white background, studio lighting, 8k quality, photorealistic, commercial product shot, small watermark text "DUTYSTOM" in corner'
  },
  {
    name: 'style2-studio-gradient',
    description: 'Студийное фото с градиентом',
    prompt: 'Dental implant titanium fixture with abutment, professional studio photography, soft gradient background from white to light gray, dramatic lighting, high end medical product, sharp details, macro photography, watermark "DUTYSTOM" bottom right corner'
  },
  {
    name: 'style3-medical-clean',
    description: 'Медицинский чистый стиль',
    prompt: 'Medical dental implant system, sterile clean presentation, titanium screw implant with components, bright clinical white background, professional medical photography, high resolution, sharp focus, text "DUTYSTOM" watermark'
  },
  {
    name: 'style4-3d-render',
    description: '3D рендер с тенью',
    prompt: 'Hyper realistic 3D render of dental implant, titanium metal texture, soft shadow on white surface, professional product visualization, medical device, clean modern style, subtle reflection, "DUTYSTOM" logo watermark'
  },
  {
    name: 'style5-catalog',
    description: 'Каталожный стиль',
    prompt: 'Dental implant for product catalog, professional e-commerce photography, pure white background, centered composition, medical titanium implant with crown, high quality commercial photo, crisp details, "DUTYSTOM" brand watermark'
  }
]

async function generateImage(style) {
  console.log(`\n🎨 Generating: ${style.name}`)
  console.log(`   ${style.description}`)

  try {
    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: style.prompt,
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

      const filename = `${style.name}.png`
      const filepath = join(IMAGES_DIR, filename)
      await writeFile(filepath, buffer)

      console.log(`   ✅ Saved: ${filename}`)
      return { success: true, name: style.name, description: style.description, path: filepath }
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`)
    return { success: false, name: style.name, error: error.message }
  }
}

async function main() {
  console.log('🚀 Generating 5 product photo styles')
  console.log(`   Token: ${process.env.REPLICATE_API_TOKEN?.substring(0, 10)}...`)

  if (!existsSync(IMAGES_DIR)) {
    await mkdir(IMAGES_DIR, { recursive: true })
    console.log(`📁 Created directory: ${IMAGES_DIR}`)
  }

  const results = []
  for (const style of styles) {
    const result = await generateImage(style)
    results.push(result)
  }

  console.log('\n📊 Results:')
  console.log('='.repeat(50))
  const successful = results.filter(r => r.success).length
  console.log(`🎯 Generated ${successful}/${styles.length} images`)
  console.log(`📂 Location: client/public/images/test-products/`)
}

main().catch(console.error)
