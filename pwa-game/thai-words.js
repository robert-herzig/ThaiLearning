// Thai words database for spelling practice
// Each word entry: [word, romanization, meaning, difficulty, audio_hint]

const THAI_WORDS = {
  beginner: [
    // 3-letter words with simple patterns
    ['มา', 'maa', 'come', 'beginner', 'Simple: consonant + vowel'],
    ['ไป', 'pai', 'go', 'beginner', 'Vowel ไ comes before consonant'],
    ['ดี', 'dee', 'good', 'beginner', 'Consonant + vowel อี'],
    ['นา', 'naa', 'field', 'beginner', 'Consonant + long vowel อา'],
    ['ปา', 'paa', 'forest', 'beginner', 'Consonant + long vowel อา'],
    ['บ้า', 'baa', 'crazy', 'beginner', 'Consonant + vowel + tone mark'],
    ['เก่า', 'gao', 'old', 'beginner', 'Vowel เ before, tone mark on consonant'],
    ['ใหม่', 'mai', 'new', 'beginner', 'Vowel ใ before consonant, tone mark'],
    
    // 4-letter words
    ['น้อง', 'nong', 'younger sibling', 'beginner', 'Consonant + tone + vowel + final consonant'],
    ['เมือง', 'meuang', 'city', 'beginner', 'Vowel เ before, complex vowel pattern'],
    ['เรือ', 'reua', 'boat', 'beginner', 'Vowel เ before, vowel เอือ pattern'],
    ['เลือก', 'leuak', 'choose', 'beginner', 'Vowel เ before, final consonant'],
  ],
  
  intermediate: [
    // 4-5 letter words with more complex patterns
    ['เสื้อ', 'seua', 'shirt', 'intermediate', 'Vowel เ before, vowel อื above, final vowel โอ'],
    ['เขียว', 'khiaw', 'green', 'intermediate', 'Vowel เ before, vowel เอียว pattern'],
    ['ผลไม้', 'phon-la-mai', 'fruit', 'intermediate', 'Compound word with vowel ไ'],
    ['เครื่อง', 'khreuang', 'machine', 'intermediate', 'Complex consonant cluster + vowel pattern'],
    ['ความ', 'khwaam', 'meaning/feeling', 'intermediate', 'Consonant cluster + long vowel'],
    ['เปลี่ยน', 'plian', 'change', 'intermediate', 'Complex consonant + vowel เอีย + final น'],
    ['เสียง', 'siang', 'sound', 'intermediate', 'Vowel เ before + complex vowel เอีย'],
    ['เวลา', 'wee-laa', 'time', 'intermediate', 'Vowel เ before + long vowel อา'],
  ]
};

// Helper function to get letters from a word (including proper vowel positioning)
function getWordLetters(word) {
  const letters = [];
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    // Handle tone marks and vowel marks that combine with previous characters
    if (char.match(/[\u0E48-\u0E4B\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/)) {
      // This is a combining mark, combine with previous letter
      if (letters.length > 0) {
        letters[letters.length - 1] += char;
      }
    } else {
      letters.push(char);
    }
  }
  return letters;
}

// Helper function to create distractors (incorrect letters) for word
function createDistractors(correctWord, count = 6) {
  const commonLetters = ['ก', 'ข', 'ค', 'ง', 'จ', 'ช', 'ด', 'ต', 'ท', 'น', 'บ', 'ป', 'ผ', 'พ', 'ฟ', 'ม', 'ย', 'ร', 'ล', 'ว', 'ส', 'ห', 'อ', 'า', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'เ', 'แ', 'โ', 'ใ', 'ไ'];
  const correctLetters = getWordLetters(correctWord);
  const distractors = [];
  
  while (distractors.length < count) {
    const randomLetter = commonLetters[Math.floor(Math.random() * commonLetters.length)];
    if (!correctLetters.includes(randomLetter) && !distractors.includes(randomLetter)) {
      distractors.push(randomLetter);
    }
  }
  
  return distractors;
}

// Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { THAI_WORDS, getWordLetters, createDistractors, shuffleArray };
}
