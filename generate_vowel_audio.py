#!/usr/bin/env python3
"""
Generate audio files for Thai vowels using Google Text-to-Speech
"""

import os
import sys
from gtts import gTTS

# Add the parent directory to path to import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def create_vowel_audio():
    """Generate audio files for Thai vowels"""
    
    # Thai vowel pronunciations with improved TTS text and filename mapping
    vowel_data = {
       'อะ': ['a_short', 'ปะ'],
        'อา': ['a_long', 'มา'],
        'อิ': ['i_short', 'กิน'],
        'อี': ['i_long', 'ดี'],
        'อึ': ['ue_short', 'ดึก'],
        'อื': ['ue_long', 'มือ'],
        'อุ': ['u_short', 'ทุก'],
        'อู': ['u_long', 'ครู'],
        'เอะ': ['e_short', 'เตะ'],
        'เอ': ['e_long', 'เท'],
        'แอะ': ['ae_short', 'แกะ'],
        'แอ': ['ae_long', 'แมว'],
        'เอียะ': ['ia_short', 'เปียก'],
        'เอีย': ['ia_long', 'เสีย'],
        'เอือะ': ['uea_short', 'เผือก'],
        'เอือ': ['uea_long', 'เสือ'],
        'อัวะ': ['ua_short', 'ดัวะ'],  # placeholder / rare
        'อัว': ['ua_long', 'ตัว'],
        'โอะ': ['o_short', 'โต๊ะ'],
        'โอ': ['o_long', 'โก'],
        'เอาะ': ['aw_short', 'เหาะ'],
        'ออ': ['aw_long', 'พ่อ'],
        'เออะ': ['ər_short', 'เผอิญ'],
        'เออ': ['ər_long', 'เจอ'],
        'อำ': ['am', 'น้ำ'],
        'ใอ': ['ai_mai', 'ใคร'],
        'ไอ': ['ai_sai', 'ไม้'],
        'เอา': ['ao', 'เอา'],
        'ฤ': ['rue_short', 'ฤดู'],
        'ฤา': ['rue_long', 'ฤาษี'],
        'ฦ': ['lue_short', '—'],   # no common modern example
        'ฦา': ['lue_long', '—']    # no common modern example
    }
    
    # Create audio directory if it doesn't exist
    audio_dir = 'pwa-game/audio'
    os.makedirs(audio_dir, exist_ok=True)
    
    print(f"Generating improved vowel audio files in {audio_dir}/...")
    
    for vowel_symbol, (filename_key, pronunciation_text) in vowel_data.items():
        try:
            filename = f"vowel_{filename_key}.mp3"
            filepath = os.path.join(audio_dir, filename)
            
            # Skip if file already exists
            if os.path.exists(filepath):
                print(f"  ✓ {filename} already exists")
                continue
            
            # Generate TTS with improved pronunciation
            tts = gTTS(text=pronunciation_text, lang='th', slow=False)
            tts.save(filepath)
            print(f"  ✓ Generated {filename} for {vowel_symbol}")
            print(f"    Audio text: {pronunciation_text}")
            
        except Exception as e:
            print(f"  ✗ Error generating audio for {vowel_symbol}: {e}")
    
    print("\nImproved vowel audio generation complete!")
    print("\nFilename mapping for reference:")
    for vowel_symbol, (filename_key, _) in vowel_data.items():
        print(f"  {vowel_symbol} → vowel_{filename_key}.mp3")

if __name__ == "__main__":
    create_vowel_audio()
