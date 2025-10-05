#!/bin/bash

# Script to start backend with network access for mobile devices
echo "🚀 Starting backend with network access..."

# Get the local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n1)

echo "📱 Backend will be accessible at:"
echo "   http://$LOCAL_IP:4000"
echo "   http://localhost:4000"
echo ""
echo "📚 API Documentation:"
echo "   http://$LOCAL_IP:4000/api/docs"
echo ""

# Start the backend
npm run start:dev
