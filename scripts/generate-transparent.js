/**
 * Генерация иконок с прозрачным фоном - Стиль 5 для всех категорий
 */

const fs = require('fs');
const path = require('path');

const REPLICATE_API_TOKEN = 'r8_24lhmxOJkbjWEiuMhwWWoZXdpZD6qxN1xjWLa';
const MODEL_VERSION = 'black-forest-labs/flux-1.1-pro';

const categories = [
  {
    name: 'implants',
    prompt: 'White outline dental implant icon, detailed medical illustration style, thin white lines only, NO background, transparent PNG, dental implant with crown and screw thread, professional clean linework, isolated object, no shadows, no fill, outline only'
  },
  {
    name: 'components',
    prompt: 'White outline dental abutment components icon, detailed medical illustration style, thin white lines only, NO background, transparent PNG, titanium abutments and screws, professional clean linework, isolated objects, no shadows, no fill, outline only'
  },
  {
    name: 'bone',
    prompt: 'White outline bone graft container icon, detailed medical illustration style, thin white lines only, NO background, transparent PNG, medical jar with bone granules, professional clean linework, isolated object, no shadows, no fill, outline only'
  },
  {
    name: 'membrane',
    prompt: 'White outline collagen membrane icon, detailed medical illustration style, thin white lines only, NO background, transparent PNG, layered dental membrane sheet, professional clean linework, isolated object, no shadows, no fill, outline only'
  },
  {
    name: 'supplies',
    prompt: 'White outline dental tools icon, detailed medical illustration style, thin white lines only, NO background, transparent PNG, dental mirror probe and syringe, professional clean linework, isolated objects, no shadows, no fill, outline only'
  }
];

async function generateIcon(category) {
  console.log(`\n🎨 Генерация: ${category.name}...`);

  try {
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
          output_quality: 95,
          safety_tolerance: 2,
          prompt_upsampling: true
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();

    let prediction = result;
    while (prediction.status === 'starting' || prediction.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await fetch(prediction.urls.get, {
        headers: { 'Authorization': `Bearer ${REPLICATE_API_TOKEN}` }
      });
      prediction = await statusResponse.json();
      console.log(`   ⏳ ${prediction.status}...`);
    }

    if (prediction.status === 'failed') {
      throw new Error('Generation failed');
    }

    const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;

    // Скачиваем
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    const outputDir = path.join(__dirname, '..', 'client', 'public', 'images', 'categories', 'style5-transparent');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${category.name}.png`);
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));

    console.log(`   ✅ Сохранено: ${category.name}.png`);
    return true;

  } catch (error) {
    console.error(`   ❌ Ошибка: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Генерация иконок с прозрачным фоном - Стиль 5\n');
  console.log('='.repeat(50));

  for (const category of categories) {
    await generateIcon(category);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n🎉 Готово! Иконки в папке:');
  console.log('   /images/categories/style5-transparent/');
  console.log('\n');
}

main().catch(console.error);
