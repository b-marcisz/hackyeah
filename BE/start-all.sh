#!/bin/bash

# Assential Project - Full Stack Startup Script
echo "🚀 Starting Assential Project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    print_status "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

print_status "Starting PostgreSQL database..."

# Start PostgreSQL with Docker Compose
if command -v docker-compose &> /dev/null; then
    docker-compose up -d postgres
else
    docker compose up -d postgres
fi

# Wait for PostgreSQL to be ready
print_status "Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is running
if ! docker ps | grep -q assential_postgres; then
    print_error "Failed to start PostgreSQL container"
    exit 1
fi

print_success "PostgreSQL is running on port 5432"

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating default configuration..."
    cat > .env << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=assential_db

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3001
EOF
    print_warning "Please update .env file with your OpenAI API key"
fi

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi

# Install UI dependencies if node_modules doesn't exist
if [ ! -d "UI/node_modules" ]; then
    print_status "Installing UI dependencies..."
    cd UI
    npm install
    cd ..
fi

# Create UI .env if it doesn't exist
if [ ! -f "UI/.env" ]; then
    print_status "Creating UI .env file..."
    cat > UI/.env << 'EOF'
REACT_APP_API_URL=http://localhost:3000
REACT_APP_DEBUG=true
EOF
fi

print_status "Starting backend server..."
# Start backend in background
npm run start:dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 5

print_status "Starting UI development server..."
# Start UI in background
cd UI
npm start &
UI_PID=$!

# Go back to root directory
cd ..

print_success "🎉 Assential Project is starting up!"
echo ""
echo "📊 Services:"
echo "  🗄️  PostgreSQL: http://localhost:5432"
echo "  🔧 Backend API: http://localhost:3000"
echo "  🎮 Frontend UI: http://localhost:3001"
echo ""
echo "📝 Useful commands:"
echo "  • View logs: docker-compose logs -f postgres"
echo "  • Stop database: docker-compose down"
echo "  • Test API: curl http://localhost:3000/api/games/start"
echo ""
echo "⚠️  Note: Make sure to set your OpenAI API key in .env file"
echo ""

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $UI_PID 2>/dev/null
    print_success "Services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
print_status "Press Ctrl+C to stop all services"
wait
