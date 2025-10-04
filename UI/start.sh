#!/bin/bash

# Number Association Games UI Startup Script

echo "🎮 Starting Number Association Games UI..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file..."
    echo "REACT_APP_API_URL=http://localhost:3000" > .env
    echo "REACT_APP_DEBUG=false" >> .env
fi

echo "🚀 Starting development server..."
echo "📱 UI will be available at: http://localhost:3001"
echo "🔗 Make sure backend is running on: http://localhost:3000"
echo ""

npm start
