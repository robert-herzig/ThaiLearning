# Quick Fix for Nginx Configuration Error

## Step 1: Restore your backup
```bash
# Find your backup
ls /var/backups/nginx-*
# Restore the backup (replace with your actual backup timestamp)
sudo cp /var/backups/nginx-20250822-*/default /etc/nginx/sites-available/default
```

## Step 2: Manually edit Nginx config
```bash
sudo nano /etc/nginx/sites-available/default
```

## Step 3: Add this INSIDE your existing server block
Find your existing server block (it should look like this):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Your existing OpenWebUI location
    location / {
        proxy_pass http://localhost:3000;
        # ... other proxy settings
    }
    
    # ADD THIS BLOCK HERE (before the closing })
    location /thai-game/ {
        alias /var/www/thai-game/;
        try_files $uri $uri/ /thai-game/index.html;
        
        location ~* \.(mp3|wav|ogg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        location ~* \.(webmanifest|js)$ {
            expires 1d;
            add_header Cache-Control "public";
        }
    }
}  # <- Make sure this closing brace is here
```

## Step 4: Test and reload
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Test your PWA
Visit: `http://your-domain.com/thai-game/`

---

## Alternative: Use the fixed script
```bash
chmod +x deployment/deploy-ionos-fixed.sh
sudo ./deployment/deploy-ionos-fixed.sh
```

The fixed script uses `awk` to properly insert the location block inside the server block instead of appending to the end of the file.
