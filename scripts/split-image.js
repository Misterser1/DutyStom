const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '..', 'ooo.png');
const outputDir = path.join(__dirname, '..', 'client', 'public', 'images');

// Создаём папки если не существуют
const categoriesDir = path.join(outputDir, 'categories');
const productsDir = path.join(outputDir, 'products');

if (!fs.existsSync(categoriesDir)) fs.mkdirSync(categoriesDir, { recursive: true });
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });

async function splitImage() {
  try {
    const metadata = await sharp(inputPath).metadata();
    console.log('Размер изображения:', metadata.width, 'x', metadata.height);

    const width = metadata.width;
    const height = metadata.height;

    // Категории (верхний ряд) - примерно 20% высоты
    const categoryHeight = Math.round(height * 0.22);
    const categoryWidth = Math.round(width / 5);

    const categories = [
      { name: 'implants', label: 'Имплантаты' },
      { name: 'components', label: 'Компоненты' },
      { name: 'bone-materials', label: 'Костные материалы' },
      { name: 'membranes', label: 'Мембраны' },
      { name: 'consumables', label: 'Расходники' }
    ];

    // Вырезаем категории
    for (let i = 0; i < 5; i++) {
      const left = i * categoryWidth;
      await sharp(inputPath)
        .extract({ left, top: 0, width: categoryWidth, height: categoryHeight })
        .toFile(path.join(categoriesDir, `${categories[i].name}.png`));
      console.log(`✓ Категория: ${categories[i].label}`);
    }

    // Продукты (нижняя часть) - разбиваем на ряды и колонки
    const productStartY = categoryHeight;
    const productAreaHeight = height - categoryHeight;

    // Определяем сетку продуктов (примерно 2 ряда по 5 продуктов)
    const productRows = 2;
    const productCols = 5;
    const productHeight = Math.round(productAreaHeight / productRows);
    const productWidth = Math.round(width / productCols);

    const products = [
      // Первый ряд
      'dio-uf-ii-hsa',
      'dio-short-hsa',
      'sportsman-sbl-5',
      'sbl-5001-ccad',
      'dio-30p-hy',
      // Второй ряд
      'dio-short-hsa-2',
      'dio-short-hsa-3',
      'extension-sbl-5',
      'ez-5001',
      'ez-5001-ccad'
    ];

    let productIndex = 0;
    for (let row = 0; row < productRows; row++) {
      for (let col = 0; col < productCols; col++) {
        if (productIndex >= products.length) break;

        const left = col * productWidth;
        const top = productStartY + row * productHeight;

        await sharp(inputPath)
          .extract({
            left,
            top,
            width: productWidth,
            height: productHeight
          })
          .toFile(path.join(productsDir, `${products[productIndex]}.png`));

        console.log(`✓ Продукт: ${products[productIndex]}`);
        productIndex++;
      }
    }

    console.log('\n✅ Готово! Изображения сохранены в:');
    console.log('   Категории:', categoriesDir);
    console.log('   Продукты:', productsDir);

  } catch (error) {
    console.error('Ошибка:', error.message);
  }
}

splitImage();
