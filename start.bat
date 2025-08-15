@echo off
echo ========================================
echo       GameStats Server Launcher
echo ========================================
echo.
echo Installing dependencies...
echo.
npm install
echo.
echo Dependencies installed successfully!
echo.
echo Starting server...
echo.
echo After startup, you can access the game at:
echo   Local:    http://localhost:5000
echo   Network:  Check console for your IP address
echo.
echo For external access:
echo 1. Use the Network address shown in console
echo 2. Configure your router to forward port 5000
echo 3. Make sure Windows Firewall allows port 5000
echo.
echo ========================================
echo.
set NODE_ENV=development
npx tsx server/index.ts
echo.
echo Server stopped. Press any key to exit...
pause > nul