#!/bin/sh
set -e

echo "Starting application..."
echo "Node version: $(node --version)"
echo "Working directory: $(pwd)"
echo "Starting NestJS application on port ${PORT:-3000}..."
echo "Binding to 0.0.0.0:${PORT:-3000}"

exec node dist/src/main.js
