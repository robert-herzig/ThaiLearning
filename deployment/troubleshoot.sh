#!/bin/bash

# Thai PWA Troubleshooting Script
# Run this on your VPS to diagnose and fix the 404 issue

echo "🔍 Diagnosing Thai PWA deployment issue..."

# Check if files exist
echo "📁 Checking if PWA files exist..."
if [ -d "/var/www/thai-game" ]; then
    echo "✅ Directory /var/www/thai-game exists"
    echo "📄 Files found:"
    ls -la /var/www/thai-game/
    echo ""
    
    # Check key files
    if [ -f "/var/www/thai-game/index.html" ]; then
        echo "✅ index.html exists"
    else
        echo "❌ index.html missing"
    fi
    
    if [ -d "/var/www/thai-game/audio" ]; then
        echo "✅ audio directory exists ($(ls /var/www/thai-game/audio | wc -l) files)"
    else
        echo "❌ audio directory missing"
    fi
else
    echo "❌ Directory /var/www/thai-game does not exist!"
    echo "📋 Need to copy files first"
    exit 1
fi

echo ""
echo "🔧 Checking Nginx configuration..."

# Check if location block exists
if grep -q "location /thai-game/" /etc/nginx/sites-available/default; then
    echo "✅ Found /thai-game/ location in Nginx config"
else
    echo "❌ /thai-game/ location missing from Nginx config"
    echo "📝 Adding location block now..."
    
    # Create backup
    sudo cp /etc/nginx/sites-available/default "/var/backups/nginx-backup-$(date +%Y%m%d-%H%M%S)"
    
    # Add location block before last closing brace
    sudo sed -i '/^[[:space:]]*}[[:space:]]*$/i\
\
    # Thai Learning PWA\
    location /thai-game/ {\
        alias /var/www/thai-game/;\
        index index.html;\
        try_files $uri $uri/ @fallback;\
    }\
    \
    location @fallback {\
        rewrite ^/thai-game/(.*)$ /thai-game/index.html last;\
    }' /etc/nginx/sites-available/default
fi

echo ""
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config is valid"
    echo "🔄 Reloading Nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
else
    echo "❌ Nginx config has errors"
    echo "📋 Please check the configuration manually"
    exit 1
fi

echo ""
echo "🌐 Testing the endpoint..."
echo "🔗 Your PWA should be available at: https://eulenai.de/thai-game/"

# Test local access
if command -v curl &> /dev/null; then
    echo "🧪 Testing local access..."
    curl -I http://localhost/thai-game/ 2>/dev/null | head -1
fi

echo ""
echo "✅ Troubleshooting complete!"
echo "📱 Try accessing: https://eulenai.de/thai-game/"
