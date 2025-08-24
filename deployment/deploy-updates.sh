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
echo "- Added WRITING PRACTICE TAB with canvas-based character drawing"
echo "- Three learning modes: Consonants + Vowels + Writing"
echo "- Touch-optimized canvas for mobile devices"
echo "- Three-phase learning: Display → Draw → Compare"
echo "- Progressive groups matching consonant/vowel learning system"
echo "- Mobile-first design with grid guidelines"
echo ""
echo "Writing Practice Features:"
echo "• Touch drawing on canvas with smooth strokes"
echo "• Character display with romanization and Thai names"
echo "• Visual comparison between drawing and correct form"
echo "• 'Clear' and 'Done' buttons for drawing control"
echo "• 'Next Character' and 'Practice Again' options"
echo "• Encouragement feedback after each character"
echo ""
echo "Complete Learning System:"
echo "• CONSONANTS: 44 characters in 8 frequency-based groups"
echo "• VOWELS: 32 characters in 5 complexity-based groups"
echo "• WRITING: Practice both consonants and vowels with canvas"
echo "• Total: 76 Thai characters with comprehensive learning modes"
echo ""
echo "Test at: https://eulenai.de/thai-game/"
