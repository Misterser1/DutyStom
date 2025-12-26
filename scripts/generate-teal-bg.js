/**
 * Генерация иконок с teal фоном (#3d9b9b)
 */

const fs = require('fs');
const path = require('path');

const REPLICATE_API_TOKEN = 'r8_24lhmxOJkbjWEiuMhwWWoZXdpZD6qxN1xjWLa';
const MODEL_VERSION = 'black-forest-labs/flux-1.1-pro';

const categories = [
  {
    name: 'implants',
    prompt: 'White line dental implant icon on solid teal background color #3d9b9b, detailed medical illustration, thin white outline drawing, dental implant with crown and screw thread, professional clean linework, centered, no shadows, simple icon'
  },
  {
    name: 'components',
    prompt: 'White line dental abutment components icon on solid teal background color #3d9b9b, detailed medical illustration, thin white outline drawing, titanium abutments and screws, professional clean linework, centered, no shadows, simple icon'
  },
  {
    name: 'bone',
    prompt: 'White line bone graft container icon on solid teal background color #3d9b9b, detailed medical illustration, thin white outline drawing, medical jar with bone granules, professional clean linework, centered, no shadows, simple icon'
  },
  {
    name: 'membrane',
    prompt: 'White line collagen membrane icon on solid teal background color #3d9b9b, detailed medical illustration, thin white outline drawing, layered dental membrane sheet, professional clean linework, centered, no shadows, simple icon'
  },
  {
    name: 'supplies',
    prompt: 'White line dental tools icon on solid teal background color #3d9b9b, detailed medical illustration, thin white outline drawing, dental mirror probe and syringe, professional clean linework, centered, no shadows, simple icon'
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

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    const outputDir = path.join(__dirname, '..', 'client', 'public', 'images', 'categories', 'teal-bg');
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
  console.log('🚀 Генерация иконок с teal фоном (#3d9b9b)\n');
  console.log('='.repeat(50));

  for (const category of categories) {
    await generateIcon(category);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n🎉 Готово! Иконки в папке: /images/categories/teal-bg/\n');
}

main().catch(console.error);
