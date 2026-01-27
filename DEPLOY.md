# DUTYSTOM - Инструкция по деплою

## Данные сервера

- **IP:** 217.26.31.24
- **User:** root
- **Password:** ваш_пароль (хранить отдельно)
- **Путь к сайту:** `/var/www/dutystom/`
- **PM2 процесс:** `dutystom-api`

## Структура на сервере

```
/var/www/dutystom/
├── dist/                    # Frontend (билд клиента)
├── images/
│   └── products/            # Изображения товаров
├── server/
│   ├── database/
│   │   └── db.sqlite        # База данных (ВАЖНО: именно db.sqlite, не dutystom.db!)
│   ├── routes/
│   └── index.js
└── package.json
```

## Полный деплой (рекомендуется)

### Шаг 1: Сборка клиента локально

```bash
cd "c:/WebSites Project/DUTYSTOM/client"
npm run build
```

### Шаг 2: Бэкап на сервере

```bash
ssh root@217.26.31.24 "cp -r /var/www/dutystom/dist /var/www/dutystom/dist_backup"
ssh root@217.26.31.24 "cp /var/www/dutystom/server/database/db.sqlite /var/www/dutystom/server/database/db.sqlite.backup"
```

### Шаг 3: Загрузка файлов

```bash
# Загрузка клиента (билда)
scp -r "c:/WebSites Project/DUTYSTOM/client/dist/"* root@217.26.31.24:/var/www/dutystom/dist/

# Загрузка всех изображений
scp -r "c:/WebSites Project/DUTYSTOM/client/public/images/products/"* root@217.26.31.24:/var/www/dutystom/images/products/

# Загрузка базы данных
scp "c:/WebSites Project/DUTYSTOM/server/database/db.sqlite" root@217.26.31.24:/var/www/dutystom/server/database/db.sqlite
```

### Шаг 4: Перезапуск сервера

```bash
ssh root@217.26.31.24 "pm2 restart dutystom-api"
```

### Шаг 5: Проверка

```bash
# Проверить статус PM2
ssh root@217.26.31.24 "pm2 status"

# Проверить количество товаров в БД
ssh root@217.26.31.24 "cd /var/www/dutystom/server && node -e \"
const initSqlJs = require('sql.js');
const fs = require('fs');
async function main() {
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync('database/db.sqlite');
  const db = new SQL.Database(buffer);
  const count = db.exec('SELECT COUNT(*) FROM products');
  console.log('Products:', count[0].values[0][0]);
}
main();
\""
```

## Быстрый деплой (только клиент)

Если изменился только фронтенд (React компоненты, стили):

```bash
# 1. Билд
cd "c:/WebSites Project/DUTYSTOM/client"
npm run build

# 2. Загрузка
scp -r "c:/WebSites Project/DUTYSTOM/client/dist/"* root@217.26.31.24:/var/www/dutystom/dist/
```

Перезапуск PM2 не требуется - nginx отдаёт статику напрямую.

## Деплой только изображений

```bash
scp -r "c:/WebSites Project/DUTYSTOM/client/public/images/products/"* root@217.26.31.24:/var/www/dutystom/images/products/
```

## Деплой только базы данных

```bash
# 1. Бэкап
ssh root@217.26.31.24 "cp /var/www/dutystom/server/database/db.sqlite /var/www/dutystom/server/database/db.sqlite.backup"

# 2. Загрузка
scp "c:/WebSites Project/DUTYSTOM/server/database/db.sqlite" root@217.26.31.24:/var/www/dutystom/server/database/db.sqlite

# 3. Перезапуск
ssh root@217.26.31.24 "pm2 restart dutystom-api"
```

## Откат к предыдущей версии

```bash
# Откат клиента
ssh root@217.26.31.24 "rm -rf /var/www/dutystom/dist && mv /var/www/dutystom/dist_backup /var/www/dutystom/dist"

# Откат базы данных
ssh root@217.26.31.24 "cp /var/www/dutystom/server/database/db.sqlite.backup /var/www/dutystom/server/database/db.sqlite && pm2 restart dutystom-api"
```

## Полезные команды

```bash
# Статус PM2
ssh root@217.26.31.24 "pm2 status"

# Логи сервера
ssh root@217.26.31.24 "pm2 logs dutystom-api --lines 50"

# Перезапуск nginx
ssh root@217.26.31.24 "systemctl restart nginx"

# Список файлов изображений
ssh root@217.26.31.24 "ls /var/www/dutystom/images/products/ | wc -l"

# Проверка места на диске
ssh root@217.26.31.24 "df -h"
```

## Важные замечания

1. **База данных** - используется `db.sqlite`, НЕ `dutystom.db` (он пустой)
2. **ES Modules** - сервер использует ES modules, скрипты для sql.js должны иметь расширение `.cjs`
3. **Изображения** - путь `/images/products/` в БД соответствует `/var/www/dutystom/images/products/` на сервере
4. **SSH timeout** - сервер может сбрасывать долгие соединения, используйте `-o ServerAliveInterval=30`

## Текущее состояние (январь 2026)

- Товаров в БД: **346**
- Изображений: **429**
- Категорий имплантатов: DIO, DENTIUM, MEGAGEN, INNO, SNUCONE, NEOBITECH, DENTIS, OSSTEM, STRAUMANN, ANTHOGYR, ASTRATECH, SIC
