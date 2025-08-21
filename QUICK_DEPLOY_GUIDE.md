# Root Tycoon - Быстрое руководство по развертыванию

## 🎯 Краткая схема

**Сейчас:** Разработка на Windows/Replit с файлами JSON
**Цель:** Продакшен на Linux сервере с MySQL и PM2

## 📋 Пошаговая инструкция

### 1. Подготовка Linux сервера

```bash
# Обновление системы (Ubuntu 20.04+)
sudo apt update && sudo apt upgrade -y

# Установка необходимых компонентов
sudo apt install -y curl git mysql-server nginx htop

# Установка Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PM2 для управления процессами
sudo npm install -g pm2

# Проверка версий
node --version    # Должно быть 18+
npm --version
mysql --version
```

### 2. Настройка MySQL базы данных

```bash
# Запуск безопасной настройки MySQL
sudo mysql_secure_installation
```

**Ответы на вопросы:**
- Remove anonymous users? → **Yes**
- Disallow root login remotely? → **Yes** 
- Remove test database? → **Yes**
- Reload privilege tables? → **Yes**

```bash
# Вход в MySQL как root
sudo mysql -u root -p
```

**В консоли MySQL выполните:**
```sql
-- Создание базы данных
CREATE DATABASE root_tycoon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создание пользователя для приложения
CREATE USER 'roottycoon'@'localhost' IDENTIFIED BY 'StrongPassword123!';

-- Предоставление прав доступа
GRANT ALL PRIVILEGES ON root_tycoon.* TO 'roottycoon'@'localhost';

-- Применение изменений
FLUSH PRIVILEGES;

-- Выход из MySQL
EXIT;
```

### 3. Перенос проекта на сервер

**Вариант А: Git (рекомендуется)**
```bash
# Клонирование в директорию веб-сервера
cd /opt
sudo git clone https://github.com/your-username/root-tycoon.git
sudo chown -R $USER:$USER root-tycoon
cd root-tycoon
```

**Вариант Б: Загрузка файлов**
```bash
# Создание директории
sudo mkdir -p /opt/root-tycoon
sudo chown -R $USER:$USER /opt/root-tycoon

# Загрузите все файлы проекта через scp/rsync/ftp
# Например через scp:
scp -r ./root-tycoon/* user@your-server:/opt/root-tycoon/
```

### 4. Настройка окружения проекта

```bash
cd /opt/root-tycoon

# Установка зависимостей
npm install

# Создание конфигурационного файла из шаблона  
cp .env.example .env

# Редактирование конфигурации
nano .env
```

**Содержимое .env файла:**
```env
# === DATABASE CONFIGURATION ===
DB_HOST=localhost
DB_PORT=3306
DB_NAME=root_tycoon
DB_USER=roottycoon
DB_PASSWORD=StrongPassword123!

# === SERVER CONFIGURATION ===
NODE_ENV=production
PORT=5000
SESSION_SECRET=your_very_long_random_secret_key_here_12345

# === BACKUP CONFIGURATION ===
BACKUP_ENABLED=true
BACKUP_RETENTION_DAYS=30
BACKUP_PATH=/var/backups/root_tycoon

# === PM2 CONFIGURATION ===
PM2_INSTANCES=max
PM2_MAX_MEMORY_RESTART=1G

# === OPTIONAL: EMAIL SETTINGS ===
# SENDGRID_API_KEY=your_sendgrid_key
# STRIPE_SECRET_KEY=your_stripe_key
# STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Важно:** 
- Замените `StrongPassword123!` на свой надежный пароль
- Замените `your_very_long_random_secret_key_here_12345` на случайную строку длиной 50+ символов

### 5. Миграция данных и запуск

```bash
# Создание директории для бэкапов
sudo mkdir -p /var/backups/root_tycoon
sudo chown -R $USER:$USER /var/backups/root_tycoon

# Тестирование подключения к базе данных
node -e "
import('./database/mysql-config.js').then(async (db) => {
  const result = await db.testConnection();
  console.log('Database connection:', result ? 'OK' : 'FAILED');
  process.exit(result ? 0 : 1);
})"

# Выполнение миграции данных из JSON в MySQL
node database/migration.js

# Запуск приложения в продакшене
pm2 start ecosystem.config.js --env production

# Сохранение конфигурации PM2
pm2 save

# Автозапуск при перезагрузке сервера
pm2 startup
# Выполните команду, которую покажет PM2 (обычно начинается с sudo)
```

### 6. Настройка Nginx (опционально)

```bash
# Создание конфигурации Nginx
sudo nano /etc/nginx/sites-available/root-tycoon
```

**Содержимое файла:**
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Замените на ваш домен

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активация конфигурации
sudo ln -s /etc/nginx/sites-available/root-tycoon /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL сертификат (опционально)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com
```

## 🔧 Управление сервером

### Основные команды PM2
```bash
# Просмотр статуса всех процессов
pm2 status

# Просмотр логов в реальном времени
pm2 logs root-tycoon

# Перезапуск приложения
pm2 restart root-tycoon

# Остановка приложения
pm2 stop root-tycoon

# Мониторинг ресурсов
pm2 monit

# Просмотр детальной информации
pm2 info root-tycoon
```

### Управление бэкапами
```bash
# Ручное создание бэкапа
node database/backup.js backup

# Восстановление из бэкапа (ОСТОРОЖНО!)
node database/backup.js restore /var/backups/root_tycoon/backup_2025-01-20.sql.gz

# Просмотр доступных бэкапов
ls -la /var/backups/root_tycoon/
```

### Мониторинг системы
```bash
# Использование ресурсов
htop

# Использование диска
df -h

# Логи MySQL
sudo tail -f /var/log/mysql/error.log

# Логи Nginx
sudo tail -f /var/log/nginx/error.log
```

## 🛠️ Обслуживание

### Обновление кода
```bash
cd /opt/root-tycoon
git pull origin main
npm install
pm2 restart root-tycoon
```

### Очистка логов
```bash
# Очистка PM2 логов
pm2 flush

# Ротация логов (настроена автоматически)
```

## 🔥 Быстрый старт (все команды подряд)

```bash
# 1. Подготовка сервера
sudo apt update && sudo apt install -y curl git mysql-server nginx
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# 2. Настройка MySQL
sudo mysql_secure_installation
sudo mysql -e "
CREATE DATABASE root_tycoon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'roottycoon'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON root_tycoon.* TO 'roottycoon'@'localhost';
FLUSH PRIVILEGES;"

# 3. Клонирование и настройка
cd /opt
sudo git clone https://github.com/your-repo/root-tycoon.git
sudo chown -R $USER:$USER root-tycoon
cd root-tycoon
npm install
cp .env.example .env
# ОТРЕДАКТИРУЙТЕ .env ФАЙЛ!

# 4. Миграция и запуск
sudo mkdir -p /var/backups/root_tycoon
sudo chown -R $USER:$USER /var/backups/root_tycoon
node database/migration.js
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 📞 Поддержка

### Частые проблемы

**Ошибка подключения к MySQL:**
```bash
sudo systemctl status mysql
sudo systemctl restart mysql
```

**Порт 5000 занят:**
```bash
sudo netstat -tulpn | grep 5000
sudo kill -9 PID
```

**Недостаточно памяти:**
```bash
# Добавление swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

**Приложение не запускается:**
```bash
pm2 logs root-tycoon --lines 50
```

### Контакты для поддержки
- Логи: `pm2 logs root-tycoon`
- Состояние системы: `htop`
- Состояние базы: `sudo systemctl status mysql`

---

**🎉 После выполнения всех шагов ваше приложение будет доступно по адресу `http://your-server-ip:5000` или через настроенный домен!**