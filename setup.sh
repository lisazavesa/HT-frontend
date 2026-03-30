#!/usr/bin/env bash

# Habit Tracker Frontend - Quick Start Script

echo "======================================"
echo "   Habit Tracker Frontend Setup"
echo "======================================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js..."
node --version

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm is installed"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check TypeScript
echo "📝 Checking TypeScript..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "⚠️  TypeScript warnings detected (continuing...)"
fi

echo ""
echo "======================================"
echo "🎉 Setup Complete!"
echo "======================================"
echo ""
echo "To start development server:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "To run ESLint:"
echo "  npm run lint"
echo ""
echo "======================================"
