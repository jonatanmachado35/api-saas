#!/bin/sh
set -e

echo "Starting application..."
echo "Node version: $(node --version)"
echo "Working directory: $(pwd)"

# Run migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy || {
  echo "Migration failed, but continuing..."
}

# Start the application
echo "Starting NestJS application on port ${PORT:-3000}..."
exec node dist/main.js
