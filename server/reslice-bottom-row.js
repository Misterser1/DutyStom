import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const inputImage = 'c:/WebSites Project/DUTYSTOM/Gemini_Generated_Image_norzk4norzk4norz.png'
const outputDir = join(__dirname, '../client/public/images/products')

async function reslice() {
  console.log('Loading source image...')
  const metadata = await sharp(inputImage).metadata()
  console.log(`Source: ${metadata.width}x${metadata.height}`)

  // Нижний ряд: 3 импланта
  // Судя по предыдущей попытке, импланты ближе друг к другу
  // Попробуем разделить иначе - каждому импланту по ~400 пикселей

  const bottomImplants = [
    {
      name: 'megagen-anyone-short',
      x: 0, y: 328,
      width: 420, height: 328,
      desc: 'Короткий с серым верхом'
    },
    {
      name: 'megagen-anyone-onestage-regular',
      x: 420, y: 328,
      width: 400, height: 328,
      desc: 'С жёлтым абатментом (Onestage Regular)'
    },
    {
      name: 'megagen-anyone-onestage-deep',
      x: 820, y: 328,
      width: 400, height: 328,
      desc: 'С зелёным кольцом (Onestage Deep)'
    },
  ]

  for (const implant of bottomImplants) {
    console.log(`\nProcessing: ${implant.name}`)
    console.log(`  Description: ${implant.desc}`)

    try {
      const outputPath = join(outputDir, `${implant.name}.png`)

      const actualWidth = Math.min(implant.width, metadata.width - implant.x)
      const actualHeight = Math.min(implant.height, metadata.height - implant.y)

      console.log(`  Extract: x=${implant.x}, y=${implant.y}, w=${actualWidth}, h=${actualHeight}`)

      const extracted = await sharp(inputImage)
        .extract({
          left: implant.x,
          top: implant.y,
          width: actualWidth,
          height: actualHeight
        })
        .toBuffer()

      await sharp(extracted)
        .trim()
        .png()
        .toFile(outputPath)

      const result = await sharp(outputPath).metadata()
      console.log(`  Saved: ${result.width}x${result.height}`)
    } catch (error) {
      console.error(`  Error: ${error.message}`)
    }
  }

  console.log('\nDone!')
}

reslice().catch(console.error)
