# Root Tycoon - Руководство по развертыванию

## Обзор

Проект можно развернуть двумя способами:
1. **Разработка**: На Windows/Mac с файловым хранилищем (текущий режим)
2. **Продакшен**: На Linux сервере с MySQL и PM2 кластеризацией

## 🖥️ Разработка (Windows/Mac)

### Текущий режим (уже настроен)
```bash
npm run dev
```
Приложение запускается на порту 5000 с файловым хранилищем.

## 🐧 Продакшен (Linux сервер)

### Шаг 1: Подготовка сервера

```bash
# Обновление системы (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Установка необходимых компонентов
sudo apt install -y curl git mysql-server nginx

# Установка Node.js 18+ 
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Проверка версий
node --version
npm --version
```

### Шаг 2: Настройка MySQL

```bash
# Безопасная настройка MySQL
sudo mysql_secure_installation

# Вход в MySQL
sudo mysql -u root -p

# Создание базы данных и пользователя
CREATE DATABASE root_tycoon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'roottycoon'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON root_tycoon.* TO 'roottycoon'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Шаг 3: Перенос проекта

**Вариант А: Через Git (рекомендуется)**
```bash
# Клонирование репозитория
cd /var/www
sudo git clone https://github.com/your-username/root-tycoon.git
sudo chown -R $USER:$USER root-tycoon
cd root-tycoon
```

**Вариант Б: Перенос файлов**
```bash
# Создание директории
sudo mkdir -p /var/www/root-tycoon
sudo chown -R $USER:$USER /var/www/root-tycoon

# Копирование файлов с Windows на Linux
# Используйте scp, rsync или любой FTP клиент
scp -r /path/to/project/* user@your-server:/var/www/root-tycoon/
```

### Шаг 4: Настройка окружения

```bash
cd /var/www/root-tycoon

# Установка зависимостей
npm install

# Установка PM2 глобально
sudo npm install -g pm2

# Создание .env файла
cp .env.example .env
nano .env
```

**Настройте .env файл:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=root_tycoon
DB_USER=roottycoon
DB_PASSWORD=your_strong_password

# Server Configuration
NODE_ENV=production
PORT=5000
SESSION_SECRET=your_very_long_random_secret_key

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_RETENTION_DAYS=30
BACKUP_PATH=/var/backups/root_tycoon

# PM2 Configuration
PM2_INSTANCES=max
PM2_MAX_MEMORY_RESTART=1G
```

### Шаг 5: Миграция данных

```bash
# Миграция данных из JSON в MySQL
node database/migration.js

# Проверка подключения к базе
node -e "import('./database/mysql-config.js').then(db => db.testConnection())"
```

### Шаг 6: Запуск в продакшене

**Автоматический запуск:**
```bash
# Запуск скрипта развертывания
chmod +x scripts/deploy.sh
./scripts/deploy.sh production
```

**Ручной запуск:**
```bash
# Запуск PM2 кластера
pm2 start ecosystem.config.js --env production

# Сохранение конфигурации PM2
pm2 save

# Автозапуск PM2 при перезагрузке
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

### Шаг 7: Настройка Nginx (опционально)

```bash
# Создание конфигурации Nginx
sudo nano /etc/nginx/sites-available/root-tycoon
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

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

### Шаг 8: SSL сертификат (опционально)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com
```

## 📊 Управление сервером

### PM2 команды
```bash
# Статус процессов
pm2 status

# Просмотр логов
pm2 logs root-tycoon

# Перезапуск
pm2 restart root-tycoon

# Остановка
pm2 stop root-tycoon

# Мониторинг ресурсов
pm2 monit

# Просмотр метрик
pm2 info root-tycoon
```

### Бэкапы
```bash
# Ручной бэкап
node database/backup.js backup

# Восстановление из бэкапа
node database/backup.js restore /path/to/backup.sql.gz

# Просмотр автоматических бэкапов
ls -la /var/backups/root_tycoon/
```

### Мониторинг
```bash
# Проверка использования ресурсов
htop

# Проверка места на диске
df -h

# Проверка логов сервера
tail -f /var/log/syslog

# PM2 логи в реальном времени
pm2 logs --lines 50
```

## 🔧 Обслуживание

### Обновление кода
```bash
cd /var/www/root-tycoon
git pull origin main
npm install
pm2 restart root-tycoon
```

### Очистка логов
```bash
# Очистка PM2 логов
pm2 flush

# Настройка logrotate уже включена в deploy.sh
```

### Проблемы и решения

**Ошибка подключения к MySQL:**
```bash
# Проверка статуса MySQL
sudo systemctl status mysql

# Перезапуск MySQL
sudo systemctl restart mysql
```

**Порт занят:**
```bash
# Проверка занятых портов
sudo netstat -tulpn | grep 5000

# Остановка процесса
sudo kill -9 PID
```

**Недостаточно памяти:**
```bash
# Увеличение swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 📝 Резюме команд для быстрого запуска

### На сервере Linux:
```bash
# 1. Установка зависимостей
sudo apt update && sudo apt install -y curl git mysql-server nginx nodejs npm
sudo npm install -g pm2

# 2. Настройка MySQL (создать БД и пользователя)

# 3. Клонирование и настройка
git clone <repo> /var/www/root-tycoon
cd /var/www/root-tycoon
npm install
cp .env.example .env
# Отредактировать .env

# 4. Миграция и запуск
node database/migration.js
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Для разработки (текущий режим):
```bash
npm run dev
```

Проект автоматически определит среду и использует соответствующее хранилище данных.