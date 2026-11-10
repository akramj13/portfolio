#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Use PORT from environment, fallback to 3000
PORT=${PORT:-3000}

echo "Deploying portfolio on port: $PORT"

# Run prisma commands
prisma generate
prisma migrate deploy

# Build the application
next build

# Stop existing PM2 process if it exists
pm2 stop portfolio 2>/dev/null || true
pm2 delete portfolio 2>/dev/null || true

# Start with PM2
pm2 start "npx next start -H 0.0.0.0 -p $PORT" --name portfolio

# Save PM2 configuration
pm2 save

echo "Deployment complete! Portfolio running on port $PORT"
