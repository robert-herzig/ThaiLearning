#!/bin/bash

# Thai PWA Deployment Script for IONOS VPS
# Run this script on your VPS to deploy the Thai learning game

set -e

echo "🚀 Deploying Thai PWA to IONOS VPS..."

# Configuration
DEPLOY_DIR="/var/www/thai-game"
NGINX_CONFIG="/etc/nginx/sites-available/default"
BACKUP_DIR="/var/backups/nginx-$(date +%Y%m%d-%H%M%S)"

# Create deployment directory
echo "📁 Creating deployment directory..."
sudo mkdir -p $DEPLOY_DIR
sudo chown $USER:www-data $DEPLOY_DIR
sudo chmod 755 $DEPLOY_DIR

# Upload files (you'll need to transfer these first)
echo "📤 Copying PWA files..."
if [ -d "./pwa-game" ]; then
    cp -r ./pwa-game/* $DEPLOY_DIR/
else
    echo "❌ Please upload the pwa-game directory first"
    exit 1
fi

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R $USER:www-data $DEPLOY_DIR
sudo find $DEPLOY_DIR -type f -exec chmod 644 {} \;
sudo find $DEPLOY_DIR -type d -exec chmod 755 {} \;

# Backup existing Nginx config
echo "💾 Backing up Nginx config..."
sudo mkdir -p $BACKUP_DIR
sudo cp $NGINX_CONFIG $BACKUP_DIR/

# Add Thai game location to Nginx config
echo "⚙️  Updating Nginx configuration..."

# Check if the Thai game location already exists
if grep -q "location /thai-game/" $NGINX_CONFIG; then
    echo "ℹ️  Thai game location already exists in Nginx config, skipping..."
else
    # Find the last closing brace of a server block and insert before it
    sudo sed -i '/^[[:space:]]*}[[:space:]]*$/i\
\
    # Thai Learning PWA\
    location /thai-game/ {\
        alias /var/www/thai-game/;\
        try_files $uri $uri/ /thai-game/index.html;\
        \
        # Enable proper MIME types for audio\
        location ~* \\.(mp3|wav|ogg)$ {\
            expires 1y;\
            add_header Cache-Control "public, immutable";\
        }\
        \
        # PWA manifest and service worker\
        location ~* \\.(webmanifest|js)$ {\
            expires 1d;\
            add_header Cache-Control "public";\
        }\
    }' $NGINX_CONFIG
fi

# Test Nginx config
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config is valid, reloading..."
    sudo systemctl reload nginx
else
    echo "❌ Nginx config error, restoring backup..."
    sudo cp $BACKUP_DIR/default $NGINX_CONFIG
    exit 1
fi

echo "🎉 Deployment complete!"
echo "📱 Your Thai PWA should now be available at: http://your-domain.com/thai-game/"
echo "💡 Don't forget to update your DNS and SSL certificates if needed"
