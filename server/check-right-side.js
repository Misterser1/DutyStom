import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const inputImage = 'c:/WebSites Project/DUTYSTOM/Gemini_Generated_Image_norzk4norzk4norz.png'
const outputDir = join(__dirname, '../client/public/images/products')

async function check() {
  const metadata = await sharp(inputImage).metadata()
  console.log(`Source: ${metadata.width}x${metadata.height}`)

  // Вырежем правую часть нижнего ряда (от x=1000 до конца)
  const outputPath = join(outputDir, 'test-right-bottom.png')

  await sharp(inputImage)
    .extract({
      left: 1000,
      top: 328,
      width: 616,  // 1616 - 1000
      height: 328
    })
    .png()
    .toFile(outputPath)

  console.log('Saved test-right-bottom.png')
}

check().catch(console.error)
