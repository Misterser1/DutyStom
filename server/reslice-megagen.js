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

  // Изображение 1616x656
  // Точные координаты каждого импланта (вручную)

  const implants = [
    // Верхний ряд - 4 импланта
    {
      name: 'megagen-bluediamond-regular',
      x: 0, y: 0,
      width: 404, height: 328,
      desc: 'Тёмный имплант #1'
    },
    {
      name: 'megagen-bluediamond-deep',
      x: 404, y: 0,
      width: 404, height: 328,
      desc: 'Тёмный имплант #2'
    },
    {
      name: 'megagen-anyone-regular',
      x: 808, y: 0,
      width: 404, height: 328,
      desc: 'С жёлтым абатментом'
    },
    {
      name: 'megagen-anyone-deep',
      x: 1212, y: 0,
      width: 404, height: 328,
      desc: 'Тёмный имплант #4'
    },

    // Нижний ряд - 3 импланта (центрированы иначе)
    {
      name: 'megagen-anyone-short',
      x: 0, y: 328,
      width: 538, height: 328,
      desc: 'Короткий с золотым'
    },
    {
      name: 'megagen-anyone-onestage-regular',
      x: 538, y: 328,
      width: 539, height: 328,
      desc: 'С жёлтым абатментом (Onestage)'
    },
    {
      name: 'megagen-anyone-onestage-deep',
      x: 1077, y: 328,
      width: 539, height: 328,
      desc: 'С зелёным кольцом'
    },
  ]

  for (const implant of implants) {
    console.log(`\nProcessing: ${implant.name}`)
    console.log(`  Description: ${implant.desc}`)

    try {
      const outputPath = join(outputDir, `${implant.name}.png`)

      // Корректируем ширину если выходит за границы
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

      // Обрезаем прозрачные края
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

  console.log('\n\n=== Готово! ===')
  console.log('Проверьте соответствие:')
  console.log('megagen-bluediamond-regular.png -> BLUEDIAMOND REGULAR (тёмный)')
  console.log('megagen-bluediamond-deep.png -> BLUEDIAMOND DEEP (тёмный)')
  console.log('megagen-anyone-regular.png -> ANYONE REGULAR (жёлтый верх)')
  console.log('megagen-anyone-deep.png -> ANYONE DEEP (тёмный)')
  console.log('megagen-anyone-short.png -> ANYONE SHORT (короткий)')
  console.log('megagen-anyone-onestage-regular.png -> ONESTAGE REGULAR (жёлтый)')
  console.log('megagen-anyone-onestage-deep.png -> ONESTAGE DEEP (зелёный)')
}

reslice().catch(console.error)
