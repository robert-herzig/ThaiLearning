// Thai vowels organized by learning groups for progressive learning
// Each vowel entry: [symbol, thai_name, romanization, sound_description, example_sound]

const VOWEL_GROUPS = {
  'Group 1: Basic Monophthongs (1-8)': [
    ['อะ', 'สระ อะ', 'sara a', 'short a', 'a'],
    ['อา', 'สระ อา', 'sara aa', 'long a', 'aa'],
    ['อิ', 'สระ อิ', 'sara i', 'short i', 'i'],
    ['อี', 'สระ อี', 'sara ii', 'long i', 'ii'],
    ['อึ', 'สระ อึ', 'sara ue', 'short ue', 'ue'],
    ['อื', 'สระ อื', 'sara uue', 'long ue', 'uue'],
    ['อุ', 'สระ อุ', 'sara u', 'short u', 'u'],
    ['อู', 'สระ อู', 'sara uu', 'long u', 'uu']
  ],
  
  'Group 2: Early Compounds & "Ae/Ia" (9-14)': [
    ['เอะ', 'สระ เอะ', 'sara e', 'short e', 'e'],
    ['เอ', 'สระ เอ', 'sara ee', 'long e', 'ee'],
    ['แอะ', 'สระ แอะ', 'sara ae', 'short ae', 'ae'],
    ['แอ', 'สระ แอ', 'sara aae', 'long ae', 'aae'],
    ['เอียะ', 'สระ เอียะ', 'sara ia', 'short ia', 'ia'],
    ['เอีย', 'สระ เอีย', 'sara iia', 'long ia', 'iia']
  ],
  
  'Group 3: "Uea/Ua" & O Sounds (15-20)': [
    ['เอือะ', 'สระ เอือะ', 'sara uea', 'short uea', 'uea'],
    ['เอือ', 'สระ เอือ', 'sara ueea', 'long uea', 'ueea'],
    ['อัวะ', 'สระ อัวะ', 'sara ua', 'short ua', 'ua'],
    ['อัว', 'สระ อัว', 'sara uua', 'long ua', 'uua'],
    ['โอะ', 'สระ โอะ', 'sara o', 'short o', 'o'],
    ['โอ', 'สระ โอ', 'sara oo', 'long o', 'oo']
  ],
  
  'Group 4: "Aw-like" & Mid Vowels (21-26)': [
    ['เอาะ', 'สระ เอาะ', 'sara aw', 'short aw', 'aw'],
    ['ออ', 'สระ ออ', 'sara aaw', 'long aw', 'aaw'],
    ['เออะ', 'สระ เออะ', 'sara ə', 'short ə', 'ər'],
    ['เออ', 'สระ เออ', 'sara əə', 'long ə', 'əə'],
    ['อำ', 'สระ อำ', 'sara am', 'am sound', 'am'],
    ['ใอ', 'สระ ใอ', 'sara ai (mai)', 'ai sound', 'ai']
  ],
  
  'Group 5: Special Forms (27-32)': [
    ['ไอ', 'สระ ไอ', 'sara ai (sai)', 'ai sound', 'ai'],
    ['เอา', 'สระ เอา', 'sara ao', 'ao sound', 'ao'],
    ['ฤ', 'สระ ฤ', 'sara rue', 'short rue', 'rue'],
    ['ฤา', 'สระ ฤา', 'sara ruue', 'long rue', 'ruue'],
    ['ฦ', 'สระ ฦ', 'sara lue', 'short lue', 'lue'],
    ['ฦา', 'สระ ฦา', 'sara luue', 'long lue', 'luue']
  ]
};

// All vowels combined for custom mode
const ALL_VOWELS = [];
Object.values(VOWEL_GROUPS).forEach(group => {
  ALL_VOWELS.push(...group);
});

// Export the groups for use in the game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VOWEL_GROUPS, ALL_VOWELS };
}
