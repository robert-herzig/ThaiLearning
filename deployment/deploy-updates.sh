#!/bin/bash

# Deploy updated Thai game files to the server

echo "=== Deploying Thai Game Updates ==="

# Move files from tmp to web directory
sudo cp /tmp/index.html /var/www/thai-game/index.html
sudo cp /tmp/styles.css /var/www/thai-game/styles.css
sudo cp /tmp/game.js /var/www/thai-game/game.js
sudo cp /tmp/frequency-groups.js /var/www/thai-game/frequency-groups.js

# Set proper permissions
sudo chown www-data:www-data /var/www/thai-game/index.html
sudo chown www-data:www-data /var/www/thai-game/styles.css
sudo chown www-data:www-data /var/www/thai-game/game.js
sudo chown www-data:www-data /var/www/thai-game/frequency-groups.js

echo "=== Deployment complete! ==="
echo "Changes:"
echo "- Added frequency-based learning groups (8 groups total)"
echo "- Group 1: Most common consonants (35%+ frequency)"
echo "- Group 8: Extremely rare consonants (<0.3% frequency)"
echo "- Progressive learning: master one group per day"
echo "- Custom size option still available"
echo "- Victory modal with congratulations and stats"
echo ""
echo "Learning Groups:"
echo "• Group 1: น ร ก อ ง ม (Super Common - 25%+)"
echo "• Group 2: ย ว ล ด ต ส (Very Common - 15-25%)"
echo "• Group 3: ค ห บ ท ป พ (Common - 10-15%)"
echo "• Group 4: จ ข ช ศ ผ ถ (Moderate - 5-10%)"
echo "• Groups 5-8: Less common to extremely rare"
echo ""
echo "Test at: https://eulenai.de/thai-game/"
