import { Router } from 'express'
import { generateImage, generateLogo, categoryPrompts, logoPrompt } from '../services/replicate.js'
import { dbGet, dbAll, dbRun } from '../database/init.js'

const router = Router()

// Генерация логотипа
router.post('/logo', async (req, res) => {
  try {
    const imagePath = await generateLogo(logoPrompt, 'logo.png')
    res.json({ success: true, path: imagePath })
  } catch (error) {
    console.error('Error generating logo:', error)
    res.status(500).json({ error: error.message })
  }
})

// Генерация изображения для конкретного товара
router.post('/product/:id', async (req, res) => {
  try {
    const { id } = req.params

    const product = dbGet(`
      SELECT p.*, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [parseInt(id)])

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Формируем промпт на основе категории и названия товара
    const basePrompt = categoryPrompts[product.category_slug] || categoryPrompts.implants
    const prompt = `${basePrompt}, ${product.name}, ${product.brand || ''}`

    const filename = `product_${id}.png`
    const imagePath = await generateImage(prompt, filename)

    // Обновляем путь к изображению в БД
    dbRun('UPDATE products SET image_url = ? WHERE id = ?', [imagePath, parseInt(id)])

    res.json({ success: true, path: imagePath })
  } catch (error) {
    console.error('Error generating product image:', error)
    res.status(500).json({ error: error.message })
  }
})

// Генерация изображений для всех товаров категории
router.post('/category/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const products = dbAll(`
      SELECT p.id, p.name, p.brand
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ? AND (p.image_url IS NULL OR p.image_url = '')
    `, [slug])

    if (products.length === 0) {
      return res.json({ message: 'No products need images', generated: 0 })
    }

    const basePrompt = categoryPrompts[slug] || categoryPrompts.implants
    const generated = []

    for (const product of products) {
      try {
        const prompt = `${basePrompt}, ${product.name}, ${product.brand || ''}`
        const filename = `product_${product.id}.png`
        const imagePath = await generateImage(prompt, filename)

        dbRun('UPDATE products SET image_url = ? WHERE id = ?', [imagePath, product.id])
        generated.push({ id: product.id, name: product.name, path: imagePath })

        // Небольшая задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (err) {
        console.error(`Failed to generate image for product ${product.id}:`, err)
      }
    }

    res.json({
      success: true,
      generated: generated.length,
      products: generated
    })
  } catch (error) {
    console.error('Error generating category images:', error)
    res.status(500).json({ error: error.message })
  }
})

// Генерация иконок категорий
router.post('/category-icons', async (req, res) => {
  try {
    const icons = [
      { slug: 'implants', filename: 'implants-icon.png', prompt: 'Minimalist dental implant icon, solid black silhouette, completely transparent PNG background, no background color, simple clean shapes, medical illustration style, centered, 1024x1024' },
      { slug: 'components', filename: 'components-icon.png', prompt: 'Minimalist dental abutment and screw icon, solid black silhouette, completely transparent PNG background, no background color, simple clean shapes, medical illustration style, centered, 1024x1024' },
      { slug: 'bone', filename: 'bone-materials-icon.png', prompt: 'Minimalist bone graft vial icon, solid black silhouette, completely transparent PNG background, no background color, simple clean shapes, medical illustration style, centered, 1024x1024' },
      { slug: 'membrane', filename: 'membranes-icon.png', prompt: 'Minimalist dental membrane layers icon, solid black silhouette, completely transparent PNG background, no background color, simple clean shapes, medical illustration style, centered, 1024x1024' },
      { slug: 'supplies', filename: 'supplies-icon.png', prompt: 'Minimalist dental suture and tools icon, solid black silhouette, completely transparent PNG background, no background color, simple clean shapes, medical illustration style, centered, 1024x1024' }
    ]

    const generated = []

    for (const icon of icons) {
      try {
        const filename = `category-icons/${icon.filename}`
        const imagePath = await generateImage(icon.prompt, filename)

        dbRun('UPDATE categories SET icon_url = ? WHERE slug = ?', [imagePath, icon.slug])
        generated.push({ slug: icon.slug, path: imagePath, prompt: icon.prompt })

        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (err) {
        console.error(`Failed to generate icon for ${icon.slug}:`, err)
      }
    }

    res.json({
      success: true,
      generated: generated.length,
      icons: generated
    })
  } catch (error) {
    console.error('Error generating category icons:', error)
    res.status(500).json({ error: error.message })
  }
})

// Генерация UI иконок (телефон, почта, корзина и т.д.)
router.post('/ui-icons', async (req, res) => {
  try {
    const icons = [
      { name: 'phone', filename: 'ui-icons/phone.png', prompt: 'Minimalist phone icon, white color on transparent background, simple flat design, clean vector style, 512x512, no shadows' },
      { name: 'email', filename: 'ui-icons/email.png', prompt: 'Minimalist envelope email icon, white color on transparent background, simple flat design, clean vector style, 512x512, no shadows' },
      { name: 'cart', filename: 'ui-icons/cart.png', prompt: 'Minimalist shopping cart icon, white color on transparent background, simple flat design, clean vector style, 512x512, no shadows' },
      { name: 'search', filename: 'ui-icons/search.png', prompt: 'Minimalist magnifying glass search icon, white color on transparent background, simple flat design, clean vector style, 512x512, no shadows' },
      { name: 'telegram', filename: 'ui-icons/telegram.png', prompt: 'Telegram logo icon, white color on transparent background, paper plane shape, simple flat design, 512x512' },
      { name: 'whatsapp', filename: 'ui-icons/whatsapp.png', prompt: 'WhatsApp logo icon, white color on transparent background, phone in speech bubble, simple flat design, 512x512' },
      { name: 'vk', filename: 'ui-icons/vk.png', prompt: 'VK VKontakte logo icon, white color on transparent background, letters VK, simple flat design, 512x512' },
      { name: 'youtube', filename: 'ui-icons/youtube.png', prompt: 'YouTube logo icon, white color on transparent background, play button in rectangle, simple flat design, 512x512' },
      { name: 'education', filename: 'ui-icons/education.png', prompt: 'Minimalist graduation cap education icon, white color on transparent background, simple flat design, clean vector style, 512x512' },
      { name: 'dropdown', filename: 'ui-icons/dropdown.png', prompt: 'Minimalist chevron down arrow icon, white color on transparent background, simple flat design, 512x512' }
    ]

    const generated = []

    for (const icon of icons) {
      try {
        const imagePath = await generateImage(icon.prompt, icon.filename)
        generated.push({ name: icon.name, path: imagePath })
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (err) {
        console.error(`Failed to generate icon ${icon.name}:`, err)
      }
    }

    res.json({
      success: true,
      generated: generated.length,
      icons: generated
    })
  } catch (error) {
    console.error('Error generating UI icons:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
