#!/bin/sh
set -e

echo "Starting application..."
echo "Node version: $(node --version)"
echo "Working directory: $(pwd)"
echo "PORT: ${PORT:-3000}"
echo "NODE_ENV: ${NODE_ENV}"
echo "DATABASE_URL: ${DATABASE_URL:0:30}..." # Show only first 30 chars for security

# List files to verify build
echo "Checking build files..."
ls -la dist/src/ || echo "Warning: dist/src directory not found!"

# Check if Prisma client is generated
if [ ! -d "node_modules/@prisma/client" ]; then
  echo "Generating Prisma Client..."
  npx prisma generate
fi

# Run database migrations (continue even if it fails)
echo "Running database migrations..."
if npx prisma migrate deploy; then
  echo "Migrations completed successfully"
else
  echo "Warning: Migration failed, but continuing to start the app..."
fi

# Optional: Run seed (uncomment if needed)
# echo "Seeding database..."
# npx prisma db seed

echo "Starting NestJS application on port ${PORT:-3000}..."
echo "Binding to 0.0.0.0:${PORT:-3000}"

# Start the application
exec node dist/src/main.js
