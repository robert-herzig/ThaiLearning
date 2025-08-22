import genanki
import os
import time
from gtts import gTTS
import warnings
warnings.filterwarnings("ignore")

class ThaiAnkiGenerator:
    def __init__(self):
        self.audio_dir = "audio"
        os.makedirs(self.audio_dir, exist_ok=True)
        
        # Define custom note types
        self.consonant_model = genanki.Model(
            1607392319,
            'Thai Consonant',
            fields=[
                {'name': 'Character'},
                {'name': 'ConsonantName'},
                {'name': 'ConsonantNameRom'},
                {'name': 'ConsonantNameAudio'},
                {'name': 'Romanization'},
                {'name': 'InitialSound'},
                {'name': 'InitialExample'},
                {'name': 'InitialAudio'},
                {'name': 'FinalSound'},
                {'name': 'FinalExample'},
                {'name': 'FinalAudio'},
                {'name': 'Notes'},
            ],
            templates=[
                {
                    'name': 'Card 1',
                    'qfmt': '''
                    <div style="text-align: center; font-size: 64px; font-family: 'Noto Sans Thai', Arial;">
                        {{Character}}
                    </div>
                    <div style="text-align: center; margin-top: 12px; font-size: 26px; font-family: 'Noto Sans Thai', Arial;">
                        {{ConsonantName}}<br><span style="font-size:16px;">{{ConsonantNameRom}}</span><br>{{ConsonantNameAudio}}
                    </div>
                    <div style="text-align: center; margin-top: 16px; font-size: 18px;">
                        (Recall class, initial & final sounds)
                    </div>
                    ''',
                    'afmt': '''
                    <div style="text-align: center; font-size: 64px; font-family: 'Noto Sans Thai', Arial;">
                        {{Character}}
                    </div>
                    <div style="text-align: center; margin-top: 10px; font-size: 26px; font-family: 'Noto Sans Thai', Arial;">
                        {{ConsonantName}}<br><span style="font-size:16px;">{{ConsonantNameRom}}</span><br>{{ConsonantNameAudio}}
                    </div>
                    <div style="text-align: center; margin-top: 10px; font-size: 22px;">
                        <strong>{{Romanization}}</strong>
                    </div>
                    <hr>
                    <div style="margin: 12px 0;">
                        <strong>Initial:</strong> {{InitialSound}}<br>
                        <strong>Example:</strong> {{InitialExample}}<br>
                        {{InitialAudio}}
                    </div>
                    <div style="margin: 12px 0;">
                        <strong>Final:</strong> {{FinalSound}}<br>
                        <strong>Example:</strong> {{FinalExample}}<br>
                        {{FinalAudio}}
                    </div>
                    <div style="margin-top: 16px; font-style: italic; font-size: 14px;">
                        {{Notes}}
                    </div>
                    ''',
                },
            ],
        )
        
        self.vowel_model = genanki.Model(
            1607392320,
            'Thai Vowel',
            fields=[
                {'name': 'Vowel'},
                {'name': 'VowelName'},
                {'name': 'VowelNameAudio'},
                {'name': 'Form'},
                {'name': 'Sound'},
                {'name': 'Example'},
                {'name': 'ExampleMeaning'},
                {'name': 'Audio'},
                {'name': 'Notes'},
            ],
            templates=[
                {
                    'name': 'Card 1',
                    'qfmt': '''
                    <div style="text-align: center; font-size: 60px; font-family: 'Noto Sans Thai', Arial;">
                        {{Vowel}}
                    </div>
                    <div style="text-align: center; margin-top: 10px; font-size: 26px; font-family: 'Noto Sans Thai', Arial;">
                        {{VowelName}}<br>{{VowelNameAudio}}
                    </div>
                    <div style="text-align: center; margin-top: 12px; font-size: 18px;">
                        (Recall sound & example)
                    </div>
                    ''',
                    'afmt': '''
                    <div style="text-align: center; font-size: 60px; font-family: 'Noto Sans Thai', Arial;">
                        {{Vowel}}
                    </div>
                    <div style="text-align: center; margin-top: 10px; font-size: 26px; font-family: 'Noto Sans Thai', Arial;">
                        {{VowelName}}<br>{{VowelNameAudio}}
                    </div>
                    <div style="text-align: center; margin-top: 12px; font-size: 22px;">
                        <strong>{{Sound}}</strong>
                    </div>
                    <div style="text-align: center; margin-top: 6px; font-size: 18px;">
                        Form: {{Form}}
                    </div>
                    <hr>
                    <div style="margin: 12px 0; text-align: center;">
                        <strong>Example:</strong> {{Example}}<br>
                        <em>{{ExampleMeaning}}</em><br>
                        {{Audio}}
                    </div>
                    <div style="margin-top: 16px; font-style: italic; font-size: 14px;">
                        {{Notes}}
                    </div>
                    ''',
                },
            ],
        )

    def create_thai_audio(self, thai_text, filename):
        """Create audio file using Google Text-to-Speech for Thai"""
        try:
            # Extract just the Thai word (before any parentheses)
            clean_text = thai_text.split('(')[0].strip()
            
            # Use Google TTS for Thai
            tts = gTTS(text=clean_text, lang='th', slow=False)
            filepath = os.path.join(self.audio_dir, filename)
            tts.save(filepath)
            
            return f"[sound:{filename}]"
        except Exception as e:
            print(f"Warning: Could not create audio for '{thai_text}': {e}")
            return ""

    def get_thai_consonants(self):
        """Thai consonants with traditional primer names.
    Tuple: (Character, ConsonantName, ConsonantNameRom, Romanization, InitialSound, InitialExample, FinalSound, FinalExample, Notes)
        ConsonantName form: <syllable for letter> <example word>, e.g. 'กอ ไก่'.
        """
        return [
            # Middle class
            ("ก", "กอ ไก่", "ko kai", "k/g", "g (voiced) initially", "ไก่ (gài) - chicken", "/k/ final", "เด็ก (dèk) - child", "Middle class; final /k/"),
            ("จ", "จอ จาน", "cho jaan", "j/t", "j (affricate) initially", "จาน (jaan) - plate", "/t/ final", "อาจ (àat) - might", "Middle class; final /t/"),
            ("ฎ", "ฎอ ชฎา", "do chada", "d/t", "d initially (rare)", "ชฎา (chadaa) - headdress", "/t/ final (rare)", "—", "Middle class; rare as final"),
            ("ฏ", "ฏอ ปฏัก", "to patak", "t/t", "t initially (rare)", "ปฏัก (pàtàk) - goad", "/t/ final (rare)", "—", "Middle class; rare as final"),
            ("ด", "ดอ เด็ก", "do dek", "d/t", "d initially", "เด็ก (dèk) - child", "/t/ final", "ผิด (phìt) - wrong", "Middle class; final /t/"),
            ("ต", "ตอ เต่า", "to tao", "t/t", "t initially", "เต่า (tào) - turtle", "/t/ final", "เขต (khèet) - district", "Middle class; final /t/"),
            ("บ", "บอ ใบไม้", "bo baimai", "b/p", "b initially", "ใบไม้ (bai-máai) - leaf", "/p/ final", "ครับ (khráp) - polite particle", "Middle class; final /p/"),
            ("ป", "ปอ ปลา", "po pla", "p/p", "p initially", "ปลา (plaa) - fish", "/p/ final", "รูป (rûup) - picture", "Middle class; final /p/"),
            ("อ", "ออ อ่าง", "o aang", "ʔ/silent", "glottal stop carrier", "อ่าง (àang) - basin", "—", "—", "Middle class; vowel carrier; not used as final consonant"),

            # High class
            ("ข", "ขอ ไข่", "kho khai", "kh/—", "kh aspirated", "ไข่ (khài) - egg", "—", "—", "High class; not used as final; final /k/ uses ก/ค/ฆ"),
            ("ฃ", "ฃอ ขวด", "kho khuat", "kh (obsolete)", "obsolete", "ขวด (khùat) - bottle (historic ฃ)", "—", "obsolete", "High class; obsolete"),
            ("ฉ", "ฉอ ฉิ่ง", "cho ching", "ch/—", "ch aspirated", "ฉิ่ง (chìng) - cymbals", "—", "—", "High class; not used as final"),
            ("ฐ", "ฐอ ฐาน", "tho than", "th/—", "th aspirated", "ฐาน (thǎan) - base", "—", "—", "High class; not used as final"),
            ("ถ", "ถอ ถุง", "tho thung", "th/—", "th aspirated", "ถุง (thǔng) - bag", "—", "—", "High class; not used as final"),
            ("ผ", "ผอ ผึ้ง", "pho phueng", "ph/—", "ph aspirated", "ผึ้ง (phʉ̂ng) - bee", "—", "—", "High class; not used as final"),
            ("ฝ", "ฝอ ฝา", "fo fa", "f/—", "f", "ฝา (fǎa) - lid", "—", "—", "High class; not used as final"),
            ("ศ", "ศอ ศาลา", "so sala", "s/t", "s", "ศาลา (sǎalaa) - pavilion", "/t/ final", "กิเลส (kì-lèet) - defilements", "High class; final /t/"),
            ("ษ", "ษอ ฤาษี", "so ruesi", "s/t", "s", "ฤาษี (rʉʉ-sǐi) - hermit", "/t/ final", "กิเลส (kì-lèet) - defilements", "High class; final /t/"),
            ("ส", "สอ เสือ", "so seua", "s/t", "s", "เสือ (sʉ̌a) - tiger", "/t/ final", "รส (rót) - taste", "High class; final /t/"),
            ("ห", "หอ หีบ", "ho hip", "h/—", "h; also silent carrier", "หีบ (hìip) - chest", "—", "—", "High class; not used as final"),

            # Low class
            ("ค", "คอ ควาย", "kho khwaai", "kh/k", "kh aspirated", "ควาย (khwaai) - buffalo", "/k/ final", "นาค (náak) - naga", "Low class; final /k/"),
            ("ฅ", "ฅอ คน", "kho khon", "kh (obsolete)", "obsolete", "คน (khon) - person (historic ฅ)", "—", "obsolete", "Low class; obsolete"),
            ("ฆ", "ฆอ ระฆัง", "kho rakhang", "kh/k", "kh", "ระฆัง (rá-khang) - bell", "/k/ final (rare)", "—", "Low class; rare as final"),
            ("ง", "งอ งู", "ngo ngoo", "ng/ng", "ng", "งู (nguu) - snake", "/ŋ/ final", "นาง (naang) - lady", "Low class; final /ŋ/"),
            ("ช", "ชอ ช้าง", "cho chaang", "ch/t", "ch", "ช้าง (cháang) - elephant", "/t/ final (loans)", "พีช (phîit) - peach", "Low class; final as /t/ mostly in loans"),
            ("ซ", "ซอ โซ่", "so soo", "s/t", "s", "โซ่ (sôo) - chain", "/t/ final", "ก๊าซ (gâat) - gas", "Low class; final /t/"),
            ("ฌ", "ฌอ เฌอ", "cho choe", "ch/—", "ch (rare)", "เฌอ (chee) - tree", "—", "—", "Low class; not used as final"),
            ("ญ", "ญอ หญิง", "yo ying", "y/n", "y (palatal)", "หญิง (yǐng) - woman", "/n/ final (Skt/Pali)", "—", "Low class; final /n/ mainly in Sanskrit/Pali; rare"),
            ("ฑ", "ฑอ มณโฑ", "tho montho", "th/t", "th (rare)", "มณโฑ (mon-tho) - Montho", "/t/ final (rare)", "—", "Low class; rare as final"),
            ("ฒ", "ฒอ ผู้เฒ่า", "tho phuthao", "th/t", "th (rare)", "ผู้เฒ่า (phûu-thâo) - elder", "/t/ final (rare)", "—", "Low class; rare as final"),
            ("ณ", "ณอ เณร", "no nen", "n/n", "n (retroflex)", "เณร (neen) - novice", "/n/ final (formal)", "—", "Low class; final /n/ mainly formal/Skt"),
            ("ท", "ทอ ทหาร", "tho thahan", "th/t", "th", "ทหาร (tha-hǎan) - soldier", "/t/ final (Skt loans)", "—", "Low class; often final /t/ in loans"),
            ("ธ", "ธอ ธง", "tho thong", "th/t", "th", "ธง (thong) - flag", "/t/ final (loans)", "พุทธ (phút) - Buddhist", "Low class; final /t/"),
            ("น", "นอ หนู", "no nuu", "n/n", "n", "หนู (nǔu) - mouse", "/n/ final", "กิน (gin) - eat", "Low class; final /n/"),
            ("พ", "พอ พาน", "pho phan", "ph/p", "ph", "พาน (phaan) - tray", "/p/ final (loans)", "—", "Low class; rare as final"),
            ("ฟ", "ฟอ ฟัน", "fo fan", "f/p", "f", "ฟัน (fan) - tooth", "/p/ final (loans)", "กราฟ (grâaf) - graph", "Low class; final /p/ mostly loans"),
            ("ภ", "ภอ สำเภา", "pho samphao", "ph/p", "ph", "สำเภา (sǎm-phao) - junk boat", "/p/ final (rare)", "—", "Low class; rare as final"),
            ("ม", "มอ ม้า", "mo maa", "m/m", "m", "ม้า (máa) - horse", "/m/ final", "นม (nom) - milk", "Low class; final /m/"),
            ("ย", "ยอ ยักษ์", "yo yak", "y/y", "y", "ยักษ์ (yák) - giant", "/j/ glide final", "ไทย (thai) - Thai", "Low class; final acts as glide"),
            ("ร", "รอ เรือ", "ro ruea", "r/n", "r (often flapped)", "เรือ (rʉa) - boat", "/n/ final (spelled ร)", "นคร (ná-khɔːn) - city", "Low class; spelled ร, pronounced /n/"),
            ("ล", "ลอ ลิง", "lo ling", "l/n", "l", "ลิง (ling) - monkey", "/n/ final (spelled ล)", "ผล (phǒn) - result", "Low class; spelled ล, pronounced /n/"),
            ("ว", "วอ แหวน", "wo waen", "w/w", "w", "แหวน (wǐaen) - ring", "/w/ glide final", "ดาว (daao) - star", "Low class; glide /w/"),
            ("ฬ", "ฬอ จุฬา", "lo chula", "l/n", "l (rare)", "จุฬา (chulā) - kite", "/n/ final (rare)", "—", "Low class; rare"),
            ("ฮ", "ฮอ นกฮูก", "ho nokhuk", "h/—", "h", "นกฮูก (nók-hûuk) - owl", "—", "—", "Low class; not used as final"),
        ]

    def get_thai_vowels(self):
        """Thai vowels with simple didactic names.
        Tuple: (Vowel, VowelName, Form, Sound, Example, ExampleMeaning, Notes)
        VowelName pattern: 'สระ ' + base form pronunciation to mirror classroom usage.
        """
        return [
            # Simple vowels (short/long)
            ("อะ", "สระ อะ", "short a", "/a/", "จะ (jà) - will", "will", "Short /a/"),
            ("อา", "สระ อา", "long aa", "/aː/", "กา (gaa) - crow", "crow", "Long /aː/"),

            ("อิ", "สระ อิ", "short i", "/i/", "คิด (khít) - think", "think", "Short /i/"),
            ("อี", "สระ อี", "long ii", "/iː/", "มี (mii) - have", "have", "Long /iː/"),

            ("อึ", "สระ อึ", "short ue", "/ɯ/", "ตึก (tʉ̀k) - building", "building", "Short /ɯ/"),
            ("อื", "สระ อือ", "long uue", "/ɯː/", "ชื่อ (chʉ̂ʉ) - name", "name", "Long /ɯː/"),

            ("อุ", "สระ อุ", "short u", "/u/", "สุข (sùk) - happiness", "happiness", "Short /u/"),
            ("อู", "สระ อู", "long uu", "/uː/", "ครู (khruu) - teacher", "teacher", "Long /uː/"),

            ("เอะ", "สระ เอะ", "short e", "/e/", "เด็ก (dèk) - child", "child", "Short /e/"),
            ("เอ", "สระ เอ", "long ee", "/eː/", "เพลง (phleeng) - song", "song", "Long /eː/"),

            ("แอะ", "สระ แอะ", "short ae", "/ɛ/", "แกะ (kɛ̀) - lamb", "lamb", "Short /ɛ/"),
            ("แอ", "สระ แอ", "long aae", "/ɛː/", "แม่ (mɛ̂ɛ) - mother", "mother", "Long /ɛː/"),

            ("โอะ", "สระ โอะ", "short o", "/o/", "โต๊ะ (tó) - table", "table", "Short /o/"),
            ("โอ", "สระ โอ", "long oo", "/oː/", "โอ่ง (ʔòːŋ) - jar", "jar", "Long /oː/"),

            ("เอาะ", "สระ เอาะ", "short ɔ", "/ɔ/", "เกาะ (kɔ̀ʔ) - island", "island", "Short /ɔ/"),
            ("ออ", "สระ ออ", "long ɔɔ", "/ɔː/", "พ่อ (phɔ̂ː) - father", "father", "Long /ɔː/"),

            # Diphthongs / closing with -j/-w glides
            ("ไอ", "สระ ไอ", "ai", "/ai/", "ไก่ (gài) - chicken", "chicken", "Diphthong ai"),
            ("ใอ", "สระ ใอ", "ai", "/ai/", "ใส (sǎi) - clear", "clear", "Diphthong ai (rare spelling)"),
            ("เอา", "สระ เอา", "ao", "/ao/", "เข้า (khâo) - enter", "enter", "Diphthong ao"),
            ("อัว", "สระ อัว", "ua", "/ua/", "ตัว (tua) - body", "body", "Diphthong ua"),
            ("อิว", "สระ อิว", "iw", "/iw/", "หิว (hǐw) - hungry", "hungry", "Closing diphthong -iw"),
            ("เอว", "สระ เอว", "eew", "/eːw/", "เอว (ʔew) - waist", "waist", "Closing diphthong -eew"),
            ("แอว", "สระ แอว", "aaew", "/ɛːw/", "แมว (maew) - cat", "cat", "Closing diphthong -aew"),
            ("โอย", "สระ โอย", "ooi", "/oːj/", "โดย (doi) - by", "by", "Closing diphthong -ooi"),
            ("อวย", "สระ อวย", "uai", "/uaj/", "สวย (sǔai) - beautiful", "beautiful", "Diphthong uai"),
            ("เอีย", "สระ เอีย", "ia", "/iːa/", "เสีย (sǐa) - spoil/lose", "spoil/lose", "Diphthong ia"),
            ("เอือ", "สระ เอือ", "ɯa", "/ɯːa/", "เรือ (rʉa) - boat", "boat", "Diphthong ʉa"),

            # Special vowel
            ("อำ", "สระ อำ", "am", "/am/", "คำ (kham) - word", "word", "Vowel + nasal"),
            ("ฤ", "สระ ฤ", "rue/ri", "/rɯ/ ~ /ri/", "ฤดู (rʉʉ-duu) - season", "season", "Special vowel"),
            ("ฤๅ", "สระ ฤๅ", "ruee/rii", "/rɯː/ ~ /riː/", "ฤๅษี (rʉʉ-sǐi) - hermit", "hermit", "Special vowel long"),
            ("ฦ", "สระ ฦ", "lue", "/lɯ/", "—", "obsolete", "Rare/obsolete"),
            ("ฦๅ", "สระ ฦๅ", "luee", "/lɯː/", "—", "obsolete", "Rare/obsolete"),
        ]

    # Validator helpers
    def _first_thai_consonant(self, text: str):
        for ch in text:
            if '\u0E01' <= ch <= '\u0E2E':  # Thai consonants ก-ฮ
                return ch
        return None

    def _last_thai_consonant(self, text: str):
        for ch in reversed(text):
            if '\u0E01' <= ch <= '\u0E2E':
                return ch
        return None

    def validate_examples(self):
        """Print warnings if examples don't match initial/final letters or typical final usage."""
        print("\nValidating examples...")
        allowed_final = set(list("กคฆงจซชษศสญณนรลฬมบดตวยปว"))  # broad set
        for (char, _cname, _cname_rom, _rom, _isound, init_ex, _fsound, final_ex, notes) in self.get_thai_consonants():
            # Initial check
            first_c = self._first_thai_consonant(init_ex)
            if first_c and first_c != char:
                print(f"⚠️  Initial example for {char} starts with '{first_c}': {init_ex}")

            # Final check
            if final_ex and final_ex not in ("—", "obsolete", ""):
                last_c = self._last_thai_consonant(final_ex)
                if last_c and last_c != char:
                    print(f"⚠️  Final example for {char} ends with '{last_c}': {final_ex}")
                if char not in allowed_final:
                    print(f"ℹ️  {char} typically not used as final. Example: {final_ex} ({notes})")
        print("Validation done.\n")

    def generate_deck(self):
        """Generate the complete Thai Anki deck"""
        print("Generating Thai Anki deck...")
        
        # Create deck
        deck = genanki.Deck(2059400110, 'Thai Language Complete')
        
        # Add consonant cards
        print("Adding consonant cards...")
        consonants = self.get_thai_consonants()
        for i, (char, cname, cname_rom, rom, init_sound, init_ex, final_sound, final_ex, notes) in enumerate(consonants):
            print(f"Processing consonant {i+1}/{len(consonants)}: {char}")
            cname_audio = self.create_thai_audio(cname, f"consonant_{char}_name.mp3")
            time.sleep(0.05)
            init_audio = self.create_thai_audio(init_ex, f"consonant_{char}_initial.mp3")
            time.sleep(0.1)
            final_audio = ""
            if final_ex and final_ex not in ("—", "obsolete") and "rare" not in final_ex.lower():
                final_audio = self.create_thai_audio(final_ex, f"consonant_{char}_final.mp3")
                time.sleep(0.1)

            note = genanki.Note(
                model=self.consonant_model,
                fields=[
                    char,           # Character
                    cname,          # ConsonantName
                    cname_rom,      # ConsonantNameRom
                    cname_audio,    # ConsonantNameAudio
                    rom,            # Romanization
                    init_sound,     # InitialSound
                    init_ex,        # InitialExample
                    init_audio,     # InitialAudio
                    final_sound,    # FinalSound
                    final_ex,       # FinalExample
                    final_audio,    # FinalAudio
                    notes,          # Notes
                ]
            )
            deck.add_note(note)
        
        # Add vowel cards
        print("Adding vowel cards...")
        vowels = self.get_thai_vowels()
        for i, (vowel, vname, form, sound, example, meaning, notes) in enumerate(vowels):
            print(f"Processing vowel {i+1}/{len(vowels)}: {vowel}")
            vname_audio = self.create_thai_audio(vname, f"vowel_{i+1}_name.mp3")
            time.sleep(0.05)
            
            # Create audio file
            audio = ""
            if "obsolete" not in example.lower():
                audio = self.create_thai_audio(example, f"vowel_{i+1}_{vowel.replace('อ', '').replace('เ', '').replace('แ', '').replace('โ', '').replace('ใ', '').replace('ไ', '')}.mp3")
                time.sleep(0.1)
            
            note = genanki.Note(
                model=self.vowel_model,
                fields=[
                    vowel,      # Vowel
                    vname,      # VowelName
                    vname_audio,# VowelNameAudio
                    form,       # Form
                    sound,      # Sound
                    example,    # Example
                    meaning,    # ExampleMeaning
                    audio,      # Audio
                    notes,      # Notes
                ]
            )
            deck.add_note(note)
        
        # Create package with media files
        print("Creating Anki package...")
        media_files = []
        if os.path.exists(self.audio_dir):
            for filename in os.listdir(self.audio_dir):
                if filename.endswith('.mp3'):
                    full_path = os.path.join(self.audio_dir, filename)
                    media_files.append(full_path)
        
        package = genanki.Package(deck)
        if media_files:
            package.media_files = media_files
            print(f"📦 Including {len(media_files)} audio files in package")
        
        output_file = 'Thai_Language_Complete.apkg'
        package.write_to_file(output_file)
        
        print(f"\n✅ Successfully created {output_file}")
        print(f"📁 Audio files saved in: {self.audio_dir}/")
        print(f"🎵 Generated {len(media_files)} audio files")
        print(f"📚 Total cards: {len(consonants) + len(vowels)}")
        print(f"   - Consonants: {len(consonants)}")
        print(f"   - Vowels: {len(vowels)}")
        
        return output_file

def main():
    print("=== Thai Anki Deck Generator ===")
    print("🇹🇭 Creating comprehensive Thai language flashcards...")
    print("📖 Including all 44 consonants and Thai vowel system")
    print("🔊 With authentic Thai pronunciation via Google TTS")
    print()
    
    try:
        generator = ThaiAnkiGenerator()
        # Validate datasets before generating
        generator.validate_examples()
        output_file = generator.generate_deck()
        
        print()
        print("=== Next Steps ===")
        print("1. Install Anki from https://apps.ankiweb.net/")
        print(f"2. Import the generated file: {output_file}")
        print("3. Start studying! 🎌")
        print()
        print("💡 Tips for studying:")
        print("   - Focus on consonant classes (high, middle, low)")
        print("   - Practice tone rules with different consonant classes")
        print("   - Listen to audio repeatedly for pronunciation")
        print("   - Learn vowel length distinctions (short vs long)")
        
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("📦 Please install requirements first:")
        print("   pip install -r requirements.txt")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("🔧 Make sure you have an internet connection for TTS")

if __name__ == "__main__":
    main()
