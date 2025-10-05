#!/bin/bash

# Script to start the entire application with mobile access
echo "🚀 Starting Assential Project with mobile access..."

# Get the local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n1)

echo "📱 Mobile access URLs:"
echo "   Frontend: http://$LOCAL_IP:3000"
echo "   Backend:  http://$LOCAL_IP:4000"
echo "   API Docs: http://$LOCAL_IP:4000/api/docs"
echo ""
echo "🔧 Make sure your phone is connected to the same WiFi network!"
echo ""

# Function to start backend
start_backend() {
    echo "🔄 Starting backend..."
    cd BE
    npm run start:dev &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🔄 Starting frontend..."
    cd UI
    HOST=0.0.0.0 PORT=3000 npm start &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    cd ..
}

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start services
start_backend
sleep 5  # Wait for backend to start
start_frontend

echo "✅ Application started successfully!"
echo "📱 Open http://$LOCAL_IP:3000 on your mobile device"
echo "🛑 Press Ctrl+C to stop all services"

# Wait for user to stop
wait
