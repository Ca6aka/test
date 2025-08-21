@echo off
echo Starting Root Tycoon Production Server...

REM Check if PM2 is installed
where pm2 >nul 2>nul
if %errorlevel% neq 0 (
    echo PM2 not found. Installing PM2...
    npm install -g pm2
)

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit .env file with your database credentials before continuing.
    pause
)

REM Run database migration
echo Running database migration...
node database\migration.js

REM Start with PM2
echo Starting server with PM2...
pm2 start ecosystem.config.js --env production

REM Save PM2 configuration
pm2 save

echo.
echo Server started successfully!
echo Use 'pm2 status' to check status
echo Use 'pm2 logs root-tycoon' to view logs
echo Use 'pm2 stop root-tycoon' to stop server
echo.
pause