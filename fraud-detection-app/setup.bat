@echo off
echo 🚀 Setting up Fraud Detection App...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing pnpm...
    npm install -g pnpm
)

echo ✅ pnpm version:
pnpm --version

REM Install dependencies
echo 📦 Installing dependencies...
pnpm install

REM Create .env.local file if it doesn't exist
if not exist .env.local (
    echo 🔧 Creating environment file...
    (
        echo # Environment variables for Fraud Detection App
        echo NEXT_PUBLIC_APP_NAME="Fraud Detection System"
        echo NEXT_PUBLIC_APP_VERSION="1.0.0"
    ) > .env.local
)

echo ✅ Setup completed successfully!
echo.
echo 🎉 To start the development server, run:
echo    pnpm dev
echo.
echo 🌐 Then open http://localhost:3000 in your browser
echo.
echo 📚 For more information, see README.md
pause 