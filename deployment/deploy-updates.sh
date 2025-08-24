#!/bin/bash

# Deploy updated Thai game files to the server

echo "=== Deploying Thai Game Updates ==="

# Move files from tmp to web directory
sudo cp /tmp/index.html /var/www/thai-game/index.html
sudo cp /tmp/styles.css /var/www/thai-game/styles.css
sudo cp /tmp/game.js /var/www/thai-game/game.js
sudo cp /tmp/frequency-groups.js /var/www/thai-game/frequency-groups.js
sudo cp /tmp/vowel-groups.js /var/www/thai-game/vowel-groups.js

# Move vowel audio files
sudo cp /tmp/vowel_*.mp3 /var/www/thai-game/audio/

# Set proper permissions
sudo chown www-data:www-data /var/www/thai-game/index.html
sudo chown www-data:www-data /var/www/thai-game/styles.css
sudo chown www-data:www-data /var/www/thai-game/game.js
sudo chown www-data:www-data /var/www/thai-game/frequency-groups.js
sudo chown www-data:www-data /var/www/thai-game/vowel-groups.js
sudo chown www-data:www-data /var/www/thai-game/audio/vowel_*.mp3

echo "=== Deployment complete! ==="
echo "Changes:"
echo "- Added VOWEL LEARNING TAB with 32 Thai vowels"
echo "- 5 progressive vowel groups for systematic learning"
echo "- Tab-based interface: Consonants + Vowels"
echo "- Complete audio support for all vowels"
echo "- Frequency-based consonant groups (8 groups total)"
echo "- Victory modal with congratulations and stats"
echo ""
echo "Vowel Learning Groups:"
echo "• Group 1: Basic Monophthongs (อะ อา อิ อี อึ อื อุ อู)"
echo "• Group 2: Early Compounds (เอะ เอ แอะ แอ เอียะ เอีย)"
echo "• Group 3: Uea/Ua & O Sounds (เอือะ เอือ อัวะ อัว โอะ โอ)"
echo "• Group 4: Aw-like & Mid Vowels (เอาะ ออ เออะ เออ อำ ใอ)"
echo "• Group 5: Special Forms (ไอ เอา ฤ ฤา ฦ ฦา)"
echo ""
echo "Consonant Learning Groups:"
echo "• Group 1: น ร ก อ ง ม (Super Common - 25%+)"
echo "• Group 2: ย ว ล ด ต ส (Very Common - 15-25%)"
echo "• Groups 3-8: Common to extremely rare consonants"
echo ""
echo "Test at: https://eulenai.de/thai-game/"
