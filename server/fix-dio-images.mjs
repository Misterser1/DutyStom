import Database from 'better-sqlite3';
const db = new Database('./database/dutystom.db');

db.prepare("UPDATE products SET image_url = '/images/products/dio-uf-ii-hsa.png' WHERE id = 338").run();
console.log('Updated DIO UF II (338)');

db.prepare("UPDATE products SET image_url = '/images/products/dio-short-hsa.png' WHERE id = 339").run();
console.log('Updated DIO SHORT (339)');

db.prepare("UPDATE products SET image_url = '/images/products/dio-ufi.png' WHERE id = 340").run();
console.log('Updated DIO UF III (340)');

db.close();
console.log('Done!');
