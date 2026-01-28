#!/bin/sh
set -e

echo "Starting application..."
echo "Node version: $(node --version)"
echo "Working directory: $(pwd)"
echo "PORT: ${PORT:-3000}"
echo "NODE_ENV: ${NODE_ENV}"

# List files to verify build
echo "Checking build files..."
ls -la dist/src/ || echo "Warning: dist/src directory not found!"

# Check if Prisma client is generated
if [ ! -d "node_modules/@prisma/client" ]; then
  echo "Generating Prisma Client..."
  npx prisma generate
fi

echo "Starting NestJS application on port ${PORT:-3000}..."
echo "Binding to 0.0.0.0:${PORT:-3000}"

# Start the application
exec node dist/src/main.js
