#!/bin/bash

# Function to check if server is running
function ping_server() {
    counter=0
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
    
    while [[ ${response} -ne 200 ]]; do
        let counter++
        if (( counter % 20 == 0 )); then
            echo "Waiting for server to start... (attempt $counter)"
        fi
        
        sleep 0.5
        response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
        
        # Timeout after 2 minutes
        if (( counter > 240 )); then
            echo "ERROR: Server failed to start after 2 minutes"
            exit 1
        fi
    done
    
    echo "✅ Server is ready!"
}

# Change to user directory
cd /home/user || exit 1

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found in /home/user"
    ls -la /home/user
    exit 1
fi

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps || {
    echo "ERROR: npm install failed"
    exit 1
}

echo "🚀 Starting Next.js dev server..."
# Start server and ping in parallel
ping_server &
PING_PID=$!

# Start dev server
npm run dev --turbopack 2>&1 | tee /tmp/dev-server.log &
DEV_PID=$!

# Wait for ping to complete
wait $PING_PID
PING_EXIT=$?

if [ $PING_EXIT -ne 0 ]; then
    echo "ERROR: Server failed to start"
    echo "=== Dev server logs ==="
    cat /tmp/dev-server.log
    kill $DEV_PID 2>/dev/null
    exit 1
fi

# Keep server running
wait $DEV_PID