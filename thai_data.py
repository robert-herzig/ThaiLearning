"""
Thai Language Data Module
Contains comprehensive Thai consonant and vowel data for language learning.
"""

# Thai Consonants Data
THAI_CONSONANTS = [
    {
        "character": "ก",
        "class": "middle",
        "initial_sound": "g",
        "final_sound": "k",
        "initial_example": "ไก่",
        "initial_meaning": "chicken",
        "final_example": "มาก",
        "final_meaning": "much"
    },
    {
        "character": "ข",
        "class": "high",
        "initial_sound": "kh",
        "final_sound": "k",
        "initial_example": "ข้าว",
        "initial_meaning": "rice",
        "final_example": "นึก",
        "final_meaning": "think"
    },
    # ... additional consonants would be added here
]

# Thai Vowels Data
THAI_VOWELS = [
    {
        "symbol": "อะ",
        "name": "sara a",
        "sound": "/a/",
        "length": "short",
        "example": "กะ",
        "meaning": "temporary"
    },
    {
        "symbol": "อา",
        "name": "sara aa",
        "sound": "/aː/",
        "length": "long",
        "example": "กา",
        "meaning": "crow"
    },
    # ... additional vowels would be added here
]

# Tone Rules
TONE_RULES = {
    "high_class": {
        "live_syllable": ["falling", "rising"],
        "dead_syllable": ["low", "falling"]
    },
    "middle_class": {
        "live_syllable": ["mid", "low", "falling", "high", "rising"],
        "dead_syllable": ["low", "high"]
    },
    "low_class": {
        "live_syllable": ["mid", "falling", "high"],
        "dead_syllable": ["high", "falling"]
    }
}

def get_consonant_info(character):
    """Get information about a Thai consonant."""
    for consonant in THAI_CONSONANTS:
        if consonant["character"] == character:
            return consonant
    return None

def get_vowel_info(symbol):
    """Get information about a Thai vowel."""
    for vowel in THAI_VOWELS:
        if vowel["symbol"] == symbol:
            return vowel
    return None

def classify_consonant(character):
    """Classify a consonant as high, middle, or low class."""
    info = get_consonant_info(character)
    return info["class"] if info else None
