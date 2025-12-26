/**
 * Генерация иконок категорий - разные стили через FLUX 1.1 Pro
 */

const fs = require('fs');
const path = require('path');

const REPLICATE_API_TOKEN = 'r8_24lhmxOJkbjWEiuMhwWWoZXdpZD6qxN1xjWLa';
const MODEL_VERSION = 'black-forest-labs/flux-1.1-pro';

const categories = ['implants', 'components', 'bone', 'membrane', 'supplies'];

// 5 разных стилей
const styles = [
  {
    name: 'style1-white-outline',
    description: 'Белые контурные',
    promptBase: 'White outline icon on transparent background, thin elegant lines, minimalist dental'
  },
  {
    name: 'style2-thin-elegant',
    description: 'Тонкие элегантные',
    promptBase: 'Ultra thin line art icon, delicate strokes, white color on transparent background, elegant minimalist dental'
  },
  {
    name: 'style3-geometric',
    description: 'Геометрические',
    promptBase: 'Geometric line icon, white outlines on transparent background, modern angular style, dental'
  },
  {
    name: 'style4-soft-glow',
    description: 'С мягким свечением',
    promptBase: 'White glowing outline icon on transparent background, soft neon glow effect, dental'
  },
  {
    name: 'style5-detailed',
    description: 'Детализированные',
    promptBase: 'Detailed white line illustration on transparent background, professional medical style, dental'
  }
];

const categoryPrompts = {
  implants: 'dental implant with crown and screw thread',
  components: 'dental abutment parts and screws',
  bone: 'bone graft granules in jar container',
  membrane: 'collagen membrane layered sheet',
  supplies: 'dental mirror probe and syringe tools'
};

async function generateIcon(style, category) {
  const prompt = `${style.promptBase} ${categoryPrompts[category]}, icon design, no text, high quality, centered`;

  console.log(`   🎨 ${category}...`);

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
          prompt: prompt,
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
    }

    if (prediction.status === 'failed') {
      throw new Error('Generation failed');
    }

    const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;

    // Скачиваем
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    const outputDir = path.join(__dirname, '..', 'client', 'public', 'images', 'categories', style.name);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${category}.png`);
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));

    console.log(`      ✅ Сохранено`);
    return true;

  } catch (error) {
    console.error(`      ❌ Ошибка: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Генерация иконок - 5 стилей x 5 категорий = 25 иконок\n');
  console.log('='.repeat(50));

  for (const style of styles) {
    console.log(`\n📁 ${style.description} (${style.name}):`);

    for (const category of categories) {
      await generateIcon(style, category);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n🎉 Все иконки сгенерированы!');
  console.log('\nПапки с иконками:');
  for (const style of styles) {
    console.log(`   📁 /images/categories/${style.name}/ - ${style.description}`);
  }
  console.log('\n');
}

main().catch(console.error);
