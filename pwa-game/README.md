# Thai Consonant Match (PWA)

Memory-style matching game to pair Thai consonant letters with their traditional (primer) names and initial/final sounds.

## Features
- Adjustable deck size (8 / 16 / 24 / 44 consonants)
- Accessible keyboard play (Enter/Space to flip)
- Responsive grid layout
- Offline capable via Service Worker (PWA)
- Uses same dataset as your Anki deck (subset exported manually to `data.js`)

## How to Run (Local)
Open `index.html` directly OR start a tiny static server to enable full PWA features:

### Python 3
```
python -m http.server 5173
```
Then browse: http://localhost:5173/pwa-game/

### Node
```
npx serve -l 5173
```

Install to home screen (mobile): open site → browser menu → "Add to Home Screen".

## Extending
- Add audio: provide mapping from consonant to existing MP3 files and inject <audio> tags when flipping.
- Auto-generate `data.js`: write a small Python script reading your consonant list in `generate_thai_deck.py` and serialize fields needed.
- Scoring variations: track accuracy %, add timer countdown, or spaced repetition weighting.

## License
Personal/educational use. Dataset originates from your custom Anki deck.
