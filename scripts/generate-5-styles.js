/**
 * Генерация 5 стилей иконок - по одной для сравнения
 */

const fs = require('fs');
const path = require('path');

const REPLICATE_API_TOKEN = 'r8_24lhmxOJkbjWEiuMhwWWoZXdpZD6qxN1xjWLa';
const MODEL_VERSION = 'black-forest-labs/flux-1.1-pro';

// 5 разных стилей - генерируем implant для сравнения
const styles = [
  {
    name: 'style1-outline',
    description: 'Белый контур',
    prompt: 'White outline dental implant icon, thin elegant lines on transparent background, minimalist single dental implant with crown and screw thread, simple icon design, no text, centered'
  },
  {
    name: 'style2-elegant',
    description: 'Тонкий элегантный',
    prompt: 'Ultra thin white line art dental implant icon, delicate strokes on transparent background, elegant minimalist dental implant with screw, professional medical icon, no text, centered'
  },
  {
    name: 'style3-geometric',
    description: 'Геометрический',
    prompt: 'Geometric white line dental implant icon, angular modern style on transparent background, stylized dental implant with geometric shapes, clean icon design, no text, centered'
  },
  {
    name: 'style4-glow',
    description: 'Светящийся',
    prompt: 'White glowing dental implant icon, soft neon glow effect on dark transparent background, elegant dental implant silhouette with subtle glow, icon design, no text, centered'
  },
  {
    name: 'style5-detailed',
    description: 'Детализированный',
    prompt: 'Detailed white line dental implant illustration on transparent background, professional medical style, realistic dental implant with crown and threading details, high quality icon, no text, centered'
  }
];

async function generateIcon(style) {
  console.log(`\n🎨 Генерация: ${style.description} (${style.name})...`);

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
          prompt: style.prompt,
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

    const outputDir = path.join(__dirname, '..', 'client', 'public', 'images', 'categories', 'styles-preview');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${style.name}.png`);
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));

    console.log(`   ✅ Сохранено: ${style.name}.png`);
    return true;

  } catch (error) {
    console.error(`   ❌ Ошибка: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Генерация 5 стилей иконок для сравнения\n');
  console.log('='.repeat(50));

  for (const style of styles) {
    await generateIcon(style);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n🎉 Готово! Иконки в папке:');
  console.log('   /images/categories/styles-preview/');
  console.log('\nСтили:');
  for (const style of styles) {
    console.log(`   📁 ${style.name}.png - ${style.description}`);
  }
  console.log('\n');
}

main().catch(console.error);
