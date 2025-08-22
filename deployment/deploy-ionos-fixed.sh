#!/bin/bash

# Fixed Thai PWA Deployment Script for IONOS VPS
# This version safely inserts the location block inside the server block

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

# Check if Thai game location already exists
if grep -q "location /thai-game/" $NGINX_CONFIG; then
    echo "ℹ️  Thai game location already exists in Nginx config"
else
    echo "⚙️  Adding Thai game location to Nginx config..."
    
    # Create a temporary file with the location block
    cat > /tmp/thai-location.conf << 'EOF'

    # Thai Learning PWA
    location /thai-game/ {
        alias /var/www/thai-game/;
        try_files $uri $uri/ /thai-game/index.html;
        
        # Enable proper MIME types for audio
        location ~* \.(mp3|wav|ogg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # PWA manifest and service worker
        location ~* \.(webmanifest|js)$ {
            expires 1d;
            add_header Cache-Control "public";
        }
    }
EOF

    # Insert before the last closing brace of the first server block
    sudo awk '
    BEGIN { found_server = 0; inserted = 0 }
    /^[[:space:]]*server[[:space:]]*{/ { found_server = 1 }
    found_server && /^[[:space:]]*}[[:space:]]*$/ && !inserted {
        system("cat /tmp/thai-location.conf")
        inserted = 1
    }
    { print }
    ' $NGINX_CONFIG > /tmp/nginx_new.conf
    
    # Replace the original config
    sudo mv /tmp/nginx_new.conf $NGINX_CONFIG
    sudo rm /tmp/thai-location.conf
fi

# Test Nginx config
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config is valid, reloading..."
    sudo systemctl reload nginx
    echo "🎉 Deployment complete!"
    echo "📱 Your Thai PWA should now be available at: http://$(hostname -f)/thai-game/"
    echo "🌐 Or at: http://your-domain.com/thai-game/"
else
    echo "❌ Nginx config error, restoring backup..."
    sudo cp $BACKUP_DIR/default $NGINX_CONFIG
    echo "💡 Please check your Nginx configuration manually"
    echo "📝 You may need to add the location block inside an existing server block"
    exit 1
fi
