#!/bin/bash

# Quick deployment script for updating the Thai PWA on IONOS VPS
# Run this after making changes to the PWA

set -e

echo "🔄 Updating Thai PWA on IONOS VPS..."

# Configuration
LOCAL_PWA_DIR="./pwa-game"
REMOTE_HOST="your-server-ip"  # Update this
REMOTE_USER="your-username"   # Update this
REMOTE_DIR="/var/www/thai-game"

# Check if local directory exists
if [ ! -d "$LOCAL_PWA_DIR" ]; then
    echo "❌ Local pwa-game directory not found"
    exit 1
fi

# Sync files to server
echo "📤 Syncing files to server..."
rsync -avz --delete \
    --exclude="*.git*" \
    --exclude="node_modules" \
    "$LOCAL_PWA_DIR/" \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

# Set permissions on server
echo "🔐 Setting permissions..."
ssh "$REMOTE_USER@$REMOTE_HOST" "
    sudo chown -R $REMOTE_USER:www-data $REMOTE_DIR &&
    sudo find $REMOTE_DIR -type f -exec chmod 644 {} \; &&
    sudo find $REMOTE_DIR -type d -exec chmod 755 {} \;
"

echo "✅ Update complete!"
echo "🌐 Check: http://your-domain.com/thai-game/"
