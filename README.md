# Thai Learning Resources 🇹🇭

A comprehensive toolkit for learning the Thai language, including Anki flashcard generation and interactive web games.

## Projects

### 1. Thai Anki Deck Generator (`generate_thai_deck.py`)

Generates a complete Anki flashcard deck for learning Thai consonants and vowels with:
- **44 Thai consonants** with traditional primer names (e.g., "กอ ไก่", "ขอ ไข่")
- **32 Thai vowels** with didactic names (e.g., "สระ อะ", "สระ อา")
- **Audio pronunciation** via Google Text-to-Speech (Thai)
- **Romanized traditional names** for accessibility
- **Validation system** to ensure example accuracy
- **Initial/final sound examples** for each consonant

### 2. Thai Consonant Match Game (`pwa-game/`)

Progressive Web App (PWA) memory matching game to practice Thai consonants:
- **Memory game mechanics**: Match Thai letters with their traditional names
- **Responsive design**: Works on mobile, tablet, and desktop
- **Offline capable**: Full PWA with service worker
- **Adjustable difficulty**: 8, 16, 24, or all 44 consonants
- **Performance tracking**: Moves, time, and completion statistics

## Features ✨

### 🔤 Complete Thai Alphabet (46 Consonants)
- All consonants with proper classification (High, Middle, Low class)
- Initial and final sounds with phonetic explanations
- Real Thai example words with meanings
- Audio pronunciation for each example

### 🔠 Comprehensive Vowel System (32 Vowels)
- Simple vowels (short and long forms)
- Complex diphthongs and triphthongs
- Special vowels including Sanskrit-derived forms
- Example words with pronunciation and meanings

### 🔊 Authentic Audio
- Google Text-to-Speech for perfect Thai pronunciation
- 107+ audio files generated automatically
- Native Thai pronunciation for all examples

## Quick Start 🚀

### Option 1: Automated Setup (Windows)
```cmd
# Double-click setup.bat or run in Command Prompt:
setup.bat
```

### Option 2: Automated Setup (Mac/Linux)
```bash
chmod +x setup.sh
./setup.sh
```

### Option 3: Manual Setup
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Generate the deck
python generate_thai_deck.py

# 3. Import Thai_Language_Complete.apkg into Anki
```

## Requirements 📋

- Python 3.7+
- Internet connection (for Google TTS)
- Anki desktop application

## What You Get 📚

After running the generator, you'll have:

- `Thai_Language_Complete.apkg` - Ready-to-import Anki deck
- `audio/` folder - 100+ Thai pronunciation files
- 78 total flashcards:
  - 46 consonant cards
  - 32 vowel cards

## Card Types 🗃️

### Consonant Cards
**Front:** Thai character (large display)
**Back:** 
- Romanization
- Initial sound with example + audio
- Final sound with example + audio  
- Consonant class information

### Vowel Cards
**Front:** Thai vowel symbol
**Back:**
- Phonetic sound notation
- Example word + audio
- English meaning
- Usage notes

## Thai Language Overview 📖

### Consonant Classes
- **High Class (11):** ข ฃ ฉ ฐ ถ ผ ฝ ศ ษ ส ห
- **Middle Class (9):** ก จ ฎ ฏ ด ต บ ป อ  
- **Low Class (24):** ค ฅ ฆ ง ช ซ ฌ ญ ณ ท ธ น พ ฟ ภ ม ย ร ล ว ฬ ฮ ฤ ฦ

### Tone System
Thai has 5 tones determined by:
- Consonant class
- Vowel length
- Final consonant
- Tone marks

## Study Tips 💡

1. **Start with consonant classes** - Essential for tone rules
2. **Practice vowel length distinctions** - Changes word meaning
3. **Listen to audio repeatedly** - Crucial for proper pronunciation  
4. **Learn common words first** - Build practical vocabulary
5. **Study tone patterns** - Follow the systematic rules

## Troubleshooting 🔧

### Common Issues

**ImportError: No module named 'gtts'**
```bash
pip install gtts genanki
```

**Audio files not generating**
- Check internet connection
- Google TTS requires connectivity
- Rate limiting may cause some files to skip

**Anki import problems**
- Make sure you have Anki desktop (not AnkiWeb)
- File > Import > Select Thai_Language_Complete.apkg

## Alternative TTS Options 🎙️

While this project uses Google TTS (which has excellent Thai support), you could also consider:

- **Azure Speech Services** - High quality, paid service
- **Amazon Polly** - Good quality, supports Thai
- **OpenAI Whisper** - Primarily STT, but can be used with workarounds
- **Festival/espeak** - Open source, lower quality

To use a different TTS service, modify the `create_thai_audio()` function in `generate_thai_deck.py`.

## Advanced Usage 🔥

### Customizing Content
Edit the data in `get_thai_consonants()` and `get_thai_vowels()` to:
- Add more example words
- Change romanization systems
- Include additional pronunciation notes
- Add custom vocabulary

### Extending the Deck
The modular design makes it easy to add:
- Tone rule cards
- Common vocabulary
- Grammar patterns
- Writing practice

## Contributing 🤝

Feel free to:
- Add more example words
- Improve romanization
- Fix pronunciation issues
- Add new card types
- Enhance the UI/styling

## License 📄

This project is open source. The Thai language data is educational content.

## Acknowledgments 🙏

- Google Text-to-Speech for Thai pronunciation
- Genanki library for Anki deck generation
- Thai language community for feedback

---

**สวัสดี (sàwàtdii)** - Happy studying! 🎌

Start your Thai learning journey today with authentic pronunciation and comprehensive coverage of the Thai writing system.
