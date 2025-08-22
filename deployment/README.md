# Thai PWA Deployment Guide for IONOS VPS

## Prerequisites
- SSH access to your IONOS VPS
- Nginx running (for OpenWebUI)
- Basic knowledge of server administration

## Step 1: Upload Files to VPS

### Option A: Using SCP
```bash
# From your local machine
scp -r pwa-game/ user@your-server-ip:/tmp/thai-game/
```

### Option B: Using Git
```bash
# On your VPS
cd /tmp
git clone https://github.com/robert-herzig/ThaiLearning.git
```

### Option C: Using rsync
```bash
# From your local machine
rsync -avz pwa-game/ user@your-server-ip:/tmp/thai-game/
```

## Step 2: Deploy on Server

```bash
# SSH into your VPS
ssh user@your-server-ip

# Navigate to uploaded files
cd /tmp/ThaiLearning  # if using git
# OR
cd /tmp/thai-game     # if using scp/rsync

# Run deployment script
chmod +x deployment/deploy-ionos.sh
sudo ./deployment/deploy-ionos.sh
```

## Step 3: Manual Nginx Configuration (Alternative)

If the script doesn't work, manually edit your Nginx config:

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/default

# Add this inside your server block:
location /thai-game/ {
    alias /var/www/thai-game/;
    try_files $uri $uri/ /thai-game/index.html;
    
    location ~* \.(mp3|wav|ogg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## Step 4: Update PWA URLs

Since the PWA will be served from `/thai-game/` subdirectory, update these files:

### In `manifest.webmanifest`:
```json
{
  "start_url": "/thai-game/",
  "scope": "/thai-game/"
}
```

### In `sw.js`:
```javascript
const CACHE_NAME = 'thai-match-v3';
const ASSETS = [
  '/thai-game/',
  '/thai-game/index.html',
  '/thai-game/styles.css',
  // ... update all paths with /thai-game/ prefix
];
```

## Step 5: SSL/HTTPS (Recommended)

If you have SSL for OpenWebUI, the Thai game will automatically use HTTPS too.

If not, set up Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Alternative: Docker Container

If you prefer containerization:

```bash
# Create Dockerfile in pwa-game directory
cat > Dockerfile << EOF
FROM nginx:alpine
COPY . /usr/share/nginx/html/
EXPOSE 80
EOF

# Build and run
docker build -t thai-pwa .
docker run -d -p 8080:80 --name thai-game thai-pwa
```

Then proxy from Nginx:
```nginx
location /thai-game/ {
    proxy_pass http://localhost:8080/;
}
```

## Testing

After deployment, test:
1. Visit `http://your-domain.com/thai-game/`
2. Check that audio files load properly
3. Test PWA installation on mobile
4. Verify service worker caching

## Troubleshooting

### Audio not playing
- Check file permissions: `sudo chmod 644 /var/www/thai-game/audio/*`
- Verify MIME types in Nginx

### 404 errors
- Check Nginx alias path: `/var/www/thai-game/`
- Verify files copied correctly

### PWA not installing
- Ensure HTTPS is working
- Check manifest.webmanifest accessibility
- Verify service worker registration

## File Structure on Server
```
/var/www/thai-game/
├── index.html
├── styles.css
├── game.js
├── data.js
├── sw.js
├── manifest.webmanifest
└── audio/
    ├── consonant_ก_name.mp3
    ├── consonant_ข_name.mp3
    └── ... (all audio files)
```
