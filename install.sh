#!/bin/bash

echo "Project Tracker Installation Helper"
echo "================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    echo "After installing Node.js, run this script again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d '.' -f1)

if [ $NODE_MAJOR -lt 18 ]; then
    echo "Your Node.js version is too old. Please install Node.js 18 or higher."
    echo "Current version: $NODE_VERSION"
    exit 1
fi

echo "Node.js version $NODE_VERSION detected."
echo

# Install dependencies
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies."
    exit 1
fi
echo "Dependencies installed successfully."
echo

# Start the development server
echo "Starting the development server..."
echo "The application will be available at http://localhost:3000"
echo "Press Ctrl+C to stop the server when you're done."
echo

# Open browser on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
# Open browser on Linux
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000 &> /dev/null || echo "Please open http://localhost:3000 in your browser"
fi

npm run dev 