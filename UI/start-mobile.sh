#!/bin/bash

# Script to start React app with network access for mobile devices
echo "🚀 Starting React app with network access..."

# Set environment variables for network access
export HOST=0.0.0.0
export PORT=3000

# Get the local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n1)

echo "📱 Mobile access URLs:"
echo "   http://$LOCAL_IP:3000"
echo "   http://localhost:3000"
echo ""
echo "🔧 Make sure your backend is running on port 4000"
echo "   Backend should be accessible at: http://$LOCAL_IP:4000"
echo ""

# Start the React app
npm start
