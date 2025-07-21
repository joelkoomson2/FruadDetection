#!/bin/bash

# Fraud Detection App Setup Script
echo "🚀 Setting up Fraud Detection App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm version: $(pnpm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment file..."
    cat > .env.local << EOF
# Environment variables for Fraud Detection App
NEXT_PUBLIC_APP_NAME="Fraud Detection System"
NEXT_PUBLIC_APP_VERSION="1.0.0"
EOF
fi

echo "✅ Setup completed successfully!"
echo ""
echo "🎉 To start the development server, run:"
echo "   pnpm dev"
echo ""
echo "🌐 Then open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md" 