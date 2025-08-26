// Thai words database for spelling practice
// Each word is an object with thai, romanization, meaning, and audio properties

const THAI_WORDS = {
  beginner: [
    // 3-letter words with simple patterns
    {
      thai: 'มา',
      romanization: 'maa',
      meaning: 'come',
      audio: 'word_มา.mp3',
      hint: 'Simple: consonant + vowel'
    },
    {
      thai: 'ไป',
      romanization: 'pai', 
      meaning: 'go',
      audio: 'word_ไป.mp3',
      hint: 'Vowel ไ comes before consonant'
    },
    {
      thai: 'ดี',
      romanization: 'dee',
      meaning: 'good',
      audio: 'word_ดี.mp3', 
      hint: 'Consonant + vowel อี'
    },
    {
      thai: 'นา',
      romanization: 'naa',
      meaning: 'rice field',
      audio: 'word_นา.mp3',
      hint: 'Consonant + long vowel อา'
    },
    {
      thai: 'ปา',
      romanization: 'paa', 
      meaning: 'forest',
      audio: 'word_ปา.mp3',
      hint: 'Consonant + long vowel อา'
    },
    {
      thai: 'บ้า',
      romanization: 'baa',
      meaning: 'crazy', 
      audio: 'word_บ้า.mp3',
      hint: 'Consonant + vowel + tone mark'
    },
    {
      thai: 'เก่า',
      romanization: 'gao',
      meaning: 'old',
      audio: 'word_เก่า.mp3',
      hint: 'Vowel เ before, tone mark on consonant'
    },
    {
      thai: 'ใหม่',
      romanization: 'mai',
      meaning: 'new',
      audio: 'word_ใหม่.mp3', 
      hint: 'Vowel ใ before consonant, tone mark'
    },
    {
      thai: 'น้อง',
      romanization: 'nong',
      meaning: 'younger sibling',
      audio: 'word_น้อง.mp3',
      hint: 'Consonant + tone + vowel + final consonant'
    },
    {
      thai: 'เมือง',
      romanization: 'meuang', 
      meaning: 'city',
      audio: 'word_เมือง.mp3',
      hint: 'Vowel เ before, complex vowel pattern'
    }
  ],
  
  intermediate: [
    // 4-5 letter words with more complex patterns
    {
      thai: 'เสื้อ',
      romanization: 'seua',
      meaning: 'shirt',
      audio: 'word_เสื้อ.mp3',
      hint: 'Vowel เ before, vowel อื above, final vowel โอ'
    },
    {
      thai: 'เขียว',
      romanization: 'khiaw',
      meaning: 'green', 
      audio: 'word_เขียว.mp3',
      hint: 'Vowel เ before, vowel เอียว pattern'
    },
    {
      thai: 'ผลไม้',
      romanization: 'phon-la-mai',
      meaning: 'fruit',
      audio: 'word_ผลไม้.mp3',
      hint: 'Compound word with vowel ไ'
    },
    {
      thai: 'เครื่อง',
      romanization: 'khreuang', 
      meaning: 'machine',
      audio: 'word_เครื่อง.mp3',
      hint: 'Complex consonant cluster + vowel pattern'
    },
    {
      thai: 'ความ',
      romanization: 'khwaam',
      meaning: 'meaning',
      audio: 'word_ความ.mp3',
      hint: 'Consonant cluster + long vowel'
    },
    {
      thai: 'เปลี่ยน',
      romanization: 'plian',
      meaning: 'change',
      audio: 'word_เปลี่ยน.mp3', 
      hint: 'Complex consonant + vowel เอีย + final น'
    },
    {
      thai: 'เสียง',
      romanization: 'siang',
      meaning: 'sound',
      audio: 'word_เสียง.mp3',
      hint: 'Vowel เ before + complex vowel เอีย'
    },
    {
      thai: 'เวลา',
      romanization: 'wee-laa',
      meaning: 'time',
      audio: 'word_เวลา.mp3',
      hint: 'Vowel เ before + long vowel อา'
    },
    {
      thai: 'เรือ',
      romanization: 'reua',
      meaning: 'boat',
      audio: 'word_เรือ.mp3',
      hint: 'Vowel เ before, vowel เอือ pattern'
    },
    {
      thai: 'เลือก',
      romanization: 'leuak', 
      meaning: 'choose',
      audio: 'word_เลือก.mp3',
      hint: 'Vowel เ before, final consonant'
    }
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
