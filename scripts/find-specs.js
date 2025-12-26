const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function check() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'server', 'database', 'dutystom.db');
  const dbBuffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(dbBuffer);

  // Find products with specs that have real characteristics (not just qty_*)
  const results = db.exec(`
    SELECT id, name, specs
    FROM products
    WHERE specs IS NOT NULL AND specs != ''
    LIMIT 30
  `);

  if (results.length > 0) {
    console.log('Products with real specs:\n');
    results[0].values.forEach(row => {
      const [id, name, specs] = row;
      try {
        const parsed = JSON.parse(specs);
        const keys = Object.keys(parsed);
        const realSpecs = keys.filter(k => !k.startsWith('qty_'));
        if (realSpecs.length > 0) {
          console.log(`ID: ${id} | ${name}`);
          console.log(`  Specs: ${realSpecs.join(', ')}`);
          console.log('');
        }
      } catch(e) {}
    });
  }
}
check();
