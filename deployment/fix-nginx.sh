#!/bin/bash

# Commands to run on the VPS to fix the nginx configuration
# Run these commands on your server after SSHing in

echo "=== Fixing nginx configuration for HTTPS access ==="

# 1. Backup the current configuration
sudo cp /etc/nginx/sites-available/eulenai /etc/nginx/sites-available/eulenai.backup

# 2. Copy the new configuration
sudo cp /tmp/eulenai-nginx.conf /etc/nginx/sites-available/eulenai

# 3. Test nginx configuration
sudo nginx -t

# 4. If test passes, reload nginx
sudo systemctl reload nginx

echo "=== Configuration applied! ==="
echo "Your Thai game should now be accessible at https://eulenai.de/thai-game/"
