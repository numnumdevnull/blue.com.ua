#!/bin/bash
set -e

APP_DIR="/var/www/blue.com.ua"

echo "==> Pulling latest code..."
cd "$APP_DIR"
git pull

echo "==> Installing dependencies..."
npm ci

echo "==> Building..."
npm run build

echo "==> Copying static assets..."
cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/public"
cp -r "$APP_DIR/.next/static" "$APP_DIR/.next/standalone/.next/static"

echo "==> Restarting app..."
pm2 restart blue

echo "✅ Deploy complete!"
