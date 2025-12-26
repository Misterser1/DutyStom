/**
 * Генерация иконок категорий через Replicate API (FLUX 1.1 Pro)
 */

const REPLICATE_API_TOKEN = 'r8_24lhmxOJkbjWEiuMhwWWoZXdpZD6qxN1xjWLa';

// FLUX 1.1 Pro - используем официальный endpoint
const MODEL_VERSION = 'black-forest-labs/flux-1.1-pro';

const categories = [
  {
    name: 'implants',
    prompt: 'Minimalist dental implant icon, blue gradient colors #60A5FA to #2563EB, professional medical illustration, clean vector style, white background, single dental implant with ceramic crown and titanium screw thread, simple elegant design, no text, high quality, flat design'
  },
  {
    name: 'components',
    prompt: 'Minimalist dental abutment components icon, blue gradient colors #60A5FA to #2563EB, professional medical illustration, clean vector style, white background, dental implant titanium abutments and small screws, simple elegant design, no text, high quality, flat design'
  },
  {
    name: 'bone',
    prompt: 'Minimalist bone graft material icon, blue and cream colors, professional medical illustration, clean vector style, white background, medical jar container with bone granules particles inside, simple elegant design, no text, high quality, flat design'
  },
  {
    name: 'membrane',
    prompt: 'Minimalist collagen membrane icon, blue gradient colors #60A5FA to #2563EB, professional medical illustration, clean vector style, white background, layered dental membrane sheet with subtle mesh texture waves, simple elegant design, no text, high quality, flat design'
  },
  {
    name: 'supplies',
    prompt: 'Minimalist dental supplies icon, blue gradient colors #60A5FA to #2563EB, professional medical illustration, clean vector style, white background, dental mirror with handle, dental probe, medical syringe, simple elegant design, no text, high quality, flat design'
  }
];

async function generateIcon(category) {
  console.log(`\n🎨 Генерация иконки: ${category.name}...`);

  try {
    // Для официальных моделей используем models endpoint
    const response = await fetch(`https://api.replicate.com/v1/models/${MODEL_VERSION}/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        input: {
          prompt: category.prompt,
          aspect_ratio: '1:1',
          output_format: 'png',
          output_quality: 90,
          safety_tolerance: 2,
          prompt_upsampling: true
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    console.log(`   ⏳ Status: ${result.status}`);

    // Если ещё обрабатывается - ждём
    let prediction = result;
    while (prediction.status === 'starting' || prediction.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const statusResponse = await fetch(prediction.urls.get, {
        headers: {
          'Authorization': `Bearer ${REPLICATE_API_TOKEN}`
        }
      });

      prediction = await statusResponse.json();
      console.log(`   ⏳ Status: ${prediction.status}...`);
    }

    if (prediction.status === 'failed') {
      throw new Error(`Generation failed: ${prediction.error}`);
    }

    // Получаем URL изображения
    const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    console.log(`   ✅ Готово! URL: ${imageUrl}`);

    // Скачиваем и сохраняем
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    const fs = require('fs');
    const path = require('path');

    const outputDir = path.join(__dirname, '..', 'client', 'public', 'images', 'categories');

    // Создаём директорию если нет
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${category.name}.png`);
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));

    console.log(`   💾 Сохранено: ${outputPath}`);

    return { name: category.name, url: imageUrl, path: outputPath };

  } catch (error) {
    console.error(`   ❌ Ошибка: ${error.message}`);
    return { name: category.name, error: error.message };
  }
}

async function main() {
  console.log('🚀 Генерация иконок категорий через FLUX 1.1 Pro\n');
  console.log('='.repeat(50));

  const results = [];

  for (const category of categories) {
    const result = await generateIcon(category);
    results.push(result);

    // Пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Результаты:\n');

  for (const result of results) {
    if (result.error) {
      console.log(`   ❌ ${result.name}: ${result.error}`);
    } else {
      console.log(`   ✅ ${result.name}: ${result.path}`);
    }
  }

  console.log('\n🎉 Готово!\n');
}

main().catch(console.error);
