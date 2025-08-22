"""
Test script to verify the Thai Anki deck was created successfully.
"""

import os
import zipfile

def test_anki_deck():
    """Test if the Anki deck file was created and is valid."""
    
    print("🧪 Testing Thai Anki Deck...")
    print()
    
    # Check if main files exist
    files_to_check = [
        "Thai_Language_Complete.apkg",
        "audio/",
        "generate_thai_deck.py",
        "requirements.txt"
    ]
    
    print("📁 Checking required files:")
    all_files_exist = True
    for file_path in files_to_check:
        if os.path.exists(file_path):
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path} - MISSING")
            all_files_exist = False
    
    if not all_files_exist:
        print("\n❌ Some files are missing. Please run generate_thai_deck.py first.")
        return False
    
    # Check audio files
    if os.path.exists("audio"):
        audio_files = [f for f in os.listdir("audio") if f.endswith('.mp3')]
        print(f"\n🎵 Audio files: {len(audio_files)} found")
        
        if len(audio_files) > 50:  # Should have 100+ files
            print("  ✅ Good number of audio files generated")
        else:
            print("  ⚠️  Fewer audio files than expected")
    
    # Check Anki deck file
    if os.path.exists("Thai_Language_Complete.apkg"):
        try:
            with zipfile.ZipFile("Thai_Language_Complete.apkg", 'r') as zip_file:
                contents = zip_file.namelist()
                print(f"\n📦 Anki deck contents: {len(contents)} files")
                
                # Check for essential parts
                has_collection = any('collection.anki2' in f for f in contents)
                has_media = any('media' in f for f in contents)
                # In genanki, audio files are stored as numbers (0, 1, 2, etc.)
                audio_in_deck = len([f for f in contents if f.isdigit()])
                
                print(f"  Database: {'✅' if has_collection else '❌'}")
                print(f"  Media folder: {'✅' if has_media else '❌'}")
                print(f"  Audio files in deck: {audio_in_deck}")
                
                if has_collection and audio_in_deck > 50:
                    print("\n🎉 Anki deck appears to be valid!")
                    return True
                else:
                    print("\n⚠️  Anki deck may have issues")
                    return False
                    
        except Exception as e:
            print(f"\n❌ Error reading Anki deck: {e}")
            return False
    
    return True

def print_usage_instructions():
    """Print instructions for using the deck."""
    print("\n" + "="*50)
    print("📚 USAGE INSTRUCTIONS")
    print("="*50)
    print()
    print("1. Install Anki:")
    print("   📥 Download from: https://apps.ankiweb.net/")
    print()
    print("2. Import the deck:")
    print("   🔄 File → Import → Select 'Thai_Language_Complete.apkg'")
    print()
    print("3. Start studying:")
    print("   🎯 Click on 'Thai Language Complete' deck")
    print("   📖 Click 'Study Now'")
    print()
    print("4. Study tips:")
    print("   🔊 Always listen to the audio")
    print("   📝 Focus on consonant classes first")
    print("   ⏰ Study consistently, even 10-15 minutes daily")
    print("   🔄 Review regularly using Anki's spaced repetition")
    print()
    print("🇹🇭 สวัสดี (sàwàtdii) - Good luck with your Thai studies!")

if __name__ == "__main__":
    success = test_anki_deck()
    
    if success:
        print_usage_instructions()
    else:
        print("\n🔧 Please fix the issues above and try again.")
        print("💡 Tip: Run 'python generate_thai_deck.py' to regenerate the deck.")
