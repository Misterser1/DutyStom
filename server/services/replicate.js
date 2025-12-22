import Replicate from 'replicate'
import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Ленивая инициализация клиента Replicate (после загрузки dotenv)
let replicateClient = null

function getReplicate() {
  if (!replicateClient) {
    const token = process.env.REPLICATE_API_TOKEN
    console.log('Initializing Replicate with token:', token ? `${token.substring(0, 10)}...` : 'NOT SET')
    replicateClient = new Replicate({
      auth: token
    })
  }
  return replicateClient
}

const IMAGES_DIR = join(__dirname, '../../client/public/images')

// Создаем папку для изображений если не существует
async function ensureImagesDir() {
  if (!existsSync(IMAGES_DIR)) {
    await mkdir(IMAGES_DIR, { recursive: true })
  }
}

/**
 * Генерация изображения через flux-schnell
 * @param {string} prompt - Описание изображения
 * @param {string} filename - Имя файла для сохранения
 * @returns {Promise<string>} - Путь к сохраненному изображению
 */
export async function generateImage(prompt, filename) {
  try {
    await ensureImagesDir()

    console.log(`Generating image: ${filename}`)
    console.log(`Prompt: ${prompt}`)

    const output = await getReplicate().run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'png',
          output_quality: 90
        }
      }
    )

    if (output && output.length > 0) {
      const imageUrl = output[0]

      // Скачиваем изображение
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Сохраняем файл (создаем подпапки при необходимости)
      const filepath = join(IMAGES_DIR, filename)
      const fileDir = dirname(filepath)
      if (!existsSync(fileDir)) {
        await mkdir(fileDir, { recursive: true })
      }
      await writeFile(filepath, buffer)

      console.log(`Image saved: ${filepath}`)
      return `/images/${filename}`
    }

    throw new Error('No output from model')
  } catch (error) {
    console.error(`Error generating image ${filename}:`, error.message)
    throw error
  }
}

/**
 * Генерация логотипа через nano-banana-pro
 * @param {string} prompt - Описание логотипа
 * @param {string} filename - Имя файла для сохранения
 * @returns {Promise<string>} - Путь к сохраненному изображению
 */
export async function generateLogo(prompt, filename) {
  try {
    await ensureImagesDir()

    console.log(`Generating logo: ${filename}`)
    console.log(`Prompt: ${prompt}`)

    // Используем flux-schnell для логотипа (более надежно)
    const output = await getReplicate().run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: '16:9',
          output_format: 'png',
          output_quality: 100
        }
      }
    )

    console.log('Model output:', JSON.stringify(output))

    // Определяем URL изображения из разных форматов ответа
    let imageUrl
    if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0]
    } else if (typeof output === 'string' && output.startsWith('http')) {
      imageUrl = output
    } else if (output && output.output) {
      imageUrl = Array.isArray(output.output) ? output.output[0] : output.output
    }

    if (!imageUrl || !imageUrl.startsWith('http')) {
      throw new Error(`Invalid output format: ${JSON.stringify(output)}`)
    }

    // Скачиваем изображение
    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Сохраняем файл
    const filepath = join(IMAGES_DIR, filename)
    await writeFile(filepath, buffer)

    console.log(`Logo saved: ${filepath}`)
    return `/images/${filename}`
  } catch (error) {
    console.error(`Error generating logo ${filename}:`, error.message)
    throw error
  }
}

/**
 * Промпты для разных категорий товаров
 */
export const categoryPrompts = {
  implants: 'Professional dental implant, titanium screw fixture, medical grade material, detailed close-up product photography, clean white background, high quality medical equipment, photorealistic, studio lighting',

  components: 'Dental abutment component, titanium healing cap, medical prosthetic part, professional product photography, white background, high detail, medical equipment',

  bone: 'Bone graft material in medical vial, xenograft granules, dental surgery material, sterile medical packaging, professional product photography, white background',

  membrane: 'Collagen membrane for dental surgery, medical grade barrier membrane, sterile packaging, professional medical product photography, white background',

  supplies: 'Dental surgical supplies kit, medical sutures and instruments, professional dental tools, sterile medical equipment, product photography, white background'
}

/**
 * Промпт для логотипа DUTYSTOM - ТОЧНАЯ КОПИЯ из PDF
 */
export const logoPrompt = `Professional dental company logo.
Exact design: The word "DUTYSTOM" in BOLD RED (#e63946) italic condensed sans-serif font.
On the LEFT side: small phone icon inside a beige circle.
On BOTH sides of "DUTYSTOM" text: decorative vertical red lines pattern (five thin vertical lines like ||||| on each side).
Layout: [beige circle with phone] ||||| DUTYSTOM |||||
Style: Clean corporate medical brand logo, high contrast, sharp edges.
Background: Pure white or transparent.
The text must be clearly readable, professional dental equipment company branding.
Red color hex #e63946, beige/cream accent #d4c5a9.`
