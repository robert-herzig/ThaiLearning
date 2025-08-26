// Remove the import since we're using global CONSONANTS from data.js
// import { CONSONANTS } from './data.js';

const gameEl = document.getElementById('game');
const groupSelect = document.getElementById('groupSelect');
const vowelGroupSelect = document.getElementById('vowelGroupSelect');
const customSizeContainer = document.getElementById('customSizeContainer');
const vowelCustomSizeContainer = document.getElementById('vowelCustomSizeContainer');
const deckSizeEl = document.getElementById('deckSize');
const vowelDeckSizeEl = document.getElementById('vowelDeckSize');
const newGameBtn = document.getElementById('newGameBtn');
const newVowelGameBtn = document.getElementById('newVowelGameBtn');
const statusEl = document.getElementById('status');
const victoryModal = document.getElementById('victoryModal');
const victoryMessage = document.getElementById('victoryMessage');
const playAgainBtn = document.getElementById('playAgainBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

// Writing practice elements
const writingPracticeEl = document.getElementById('writing-practice');
const writingTypeSelect = document.getElementById('writingTypeSelect');
const writingGroupSelect = document.getElementById('writingGroupSelect');
const startWritingBtn = document.getElementById('startWritingBtn');
const characterDisplay = document.getElementById('character-display');
const drawingPhase = document.getElementById('drawing-phase');
const resultPhase = document.getElementById('result-phase');
const startDrawingBtn = document.getElementById('start-drawing');
const replayAudioBtn = document.getElementById('replay-audio');
const clearCanvasBtn = document.getElementById('clear-canvas');
const doneDrawingBtn = document.getElementById('done-drawing');
const nextCharacterBtn = document.getElementById('next-character');
const practiceAgainBtn = document.getElementById('practice-again');
const drawingCanvas = document.getElementById('drawing-canvas');
const resultCanvas = document.getElementById('result-canvas');

// Tab elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Game state
let currentMode = 'consonants'; // 'consonants', 'vowels', or 'writing'

// Writing practice state
let writingCharacters = [];
let currentCharacterIndex = 0;
let currentCharacter = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let ctx = null;
let resultCtx = null;

let firstCard = null;
let lock = false;
let matches = 0;
let totalPairs = 0;
let moves = 0;
let startTime = 0;
let timerId = null;

// Tab switching functionality
function switchTab(tabName) {
  currentMode = tabName;
  
  // Update tab buttons
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  
  // Update tab content
  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === `${tabName}-tab`);
  });
  
  // Show/hide appropriate sections
  if (tabName === 'writing') {
    gameEl.style.display = 'none';
    writingPracticeEl.style.display = 'block';
    const spellingTab = document.getElementById('spelling-tab');
    if (spellingTab) spellingTab.style.display = 'none';
    statusEl.textContent = '';
    // Make sure to populate the groups when switching to writing tab
    setTimeout(updateWritingGroupOptions, 100); // Small delay to ensure DOM is ready
  } else if (tabName === 'spelling') {
    gameEl.style.display = 'none';
    writingPracticeEl.style.display = 'none';
    const spellingTab = document.getElementById('spelling-tab');
    if (spellingTab) spellingTab.style.display = 'block';
    statusEl.textContent = '';
  } else {
    gameEl.style.display = 'grid';
    writingPracticeEl.style.display = 'none';
    const spellingTab = document.getElementById('spelling-tab');
    if (spellingTab) spellingTab.style.display = 'none';
    // Clear the game board when switching tabs
    gameEl.innerHTML = '';
    statusEl.textContent = '';
  }
  
  // Cancel any running timer
  if (timerId) {
    cancelAnimationFrame(timerId);
    timerId = null;
  }
}

function sample(array, n){
  const arr = [...array];
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()* (i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr.slice(0,n);
}

function buildPairs(items, mode = 'consonants'){
  const cards = [];
  
  items.forEach((item, idx) => {
    if (mode === 'consonants') {
      // Consonant format: [char, nameThai, nameRom, initSound, finalSound]
      const [char, nameThai, nameRom, initSound, finalSound] = item;
      cards.push({
        id: `L-${idx}`,
        type: 'letter',
        key: char,
        char: char,
        display: `<div class='big'>${char}</div>`
      });
      const infoHtml = `
        <div class='thai small'>${nameThai}</div>
        <div class='roman'>${nameRom}</div>
        <div class='meta'>Init: ${escapeHtml(initSound)}<br>Final: ${escapeHtml(finalSound)}</div>`;
      cards.push({
        id: `I-${idx}`,
        type: 'info',
        key: char,
        char: char,
        display: infoHtml
      });
    } else {
      // Vowel format: [symbol, thai_name, romanization, sound_description, example_sound]
      const [symbol, thaiName, romanization, soundDesc, exampleSound] = item;
      cards.push({
        id: `L-${idx}`,
        type: 'vowel',
        key: symbol,
        char: symbol,
        display: `<div class='big vowel-symbol'>${symbol}</div>`
      });
      const infoHtml = `
        <div class='thai small'>${thaiName}</div>
        <div class='roman'>${romanization}</div>
        <div class='meta'>Sound: ${escapeHtml(soundDesc)}<br>Example: ${escapeHtml(exampleSound)}</div>`;
      cards.push({
        id: `I-${idx}`,
        type: 'vowel-info',
        key: symbol,
        char: symbol,
        display: infoHtml
      });
    }
  });
  return cards;
}

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()* (i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
}

function render(cards){
  console.log('Rendering cards:', cards.length);
  gameEl.innerHTML='';
  const frag = document.createDocumentFragment();
  cards.forEach(card => {
    const div = document.createElement('div');
    div.className='card';
    div.setAttribute('tabindex','0');
    div.dataset.key = card.key;
    div.dataset.type = card.type;
    div.dataset.char = card.char;
    div.innerHTML = `
      <div class='inner'>
        <div class='face front'></div>
        <div class='face back'>${card.display}</div>
      </div>
    `;
    div.addEventListener('click', ()=>onReveal(div));
    div.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' ') { e.preventDefault(); onReveal(div);} });
    frag.appendChild(div);
  });
  gameEl.appendChild(frag);
  
  // Grid columns are now handled by CSS media queries for better responsive design
  console.log('Rendered', cards.length, 'cards with CSS-controlled responsive grid');
}

function playAudio(char, mode = null) {
  // If mode is not specified, determine from current game mode
  if (!mode) {
    mode = currentMode;
  }
  
  try {
    let audioPath;
    if (mode === 'consonants') {
      audioPath = `audio/consonant_${char}_name.mp3`;
    } else {
      // For vowels, use the improved filename mapping
      const vowelFilenameMap = {
        'อะ': 'a_short',
        'อา': 'a_long',
        'อิ': 'i_short',
        'อี': 'i_long',
        'อึ': 'ue_short',
        'อื': 'ue_long',
        'อุ': 'u_short',
        'อู': 'u_long',
        'เอะ': 'e_short',
        'เอ': 'e_long',
        'แอะ': 'ae_short',
        'แอ': 'ae_long',
        'เอียะ': 'ia_short',
        'เอีย': 'ia_long',
        'เอือะ': 'uea_short',
        'เอือ': 'uea_long',
        'อัวะ': 'ua_short',
        'อัว': 'ua_long',
        'โอะ': 'o_short',
        'โอ': 'o_long',
        'เอาะ': 'aw_short',
        'ออ': 'aw_long',
        'เออะ': 'ər_short',
        'เออ': 'ər_long',
        'อำ': 'am',
        'ใอ': 'ai_mai',
        'ไอ': 'ai_sai',
        'เอา': 'ao',
        'ฤ': 'rue_short',
        'ฤา': 'rue_long',
        'ฦ': 'lue_short',
        'ฦา': 'lue_long'
      };
      
      const filenameKey = vowelFilenameMap[char];
      if (filenameKey) {
        audioPath = `audio/vowel_${filenameKey}.mp3`;
      } else {
        console.log(`No audio mapping found for vowel: ${char}`);
        return;
      }
    }
    
    const audio = new Audio(audioPath);
    
    audio.addEventListener('error', () => {
      console.log(`Audio file not found: ${audioPath}`);
    });
    
    audio.addEventListener('canplay', () => {
      console.log(`Playing audio for ${mode}: ${char}`);
    });
    
    audio.play().catch(err => {
      console.log(`Could not play audio for ${char}:`, err.message);
    });
  } catch (error) {
    console.log(`Audio playback error for ${char}:`, error.message);
  }
}

function onReveal(cardEl){
  if(lock || cardEl.classList.contains('revealed') || cardEl.classList.contains('matched')) return;
  cardEl.classList.add('revealed');
  
  // Play audio for info cards when revealed (both consonants and vowels)
  if ((cardEl.dataset.type === 'info' || cardEl.dataset.type === 'vowel-info') && cardEl.dataset.char) {
    playAudio(cardEl.dataset.char, currentMode);
  }
  
  const revealed = cardEl;

  if(!firstCard){
    firstCard = revealed;
    return;
  }

  moves++;
  const secondCard = revealed;
  const match = firstCard.dataset.key === secondCard.dataset.key && firstCard !== secondCard;

  if(match){
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matches++;
    firstCard = null;
    if(matches === totalPairs){
      endGame();
    }
  } else {
    lock = true;
    setTimeout(()=>{
      firstCard.classList.remove('revealed');
      secondCard.classList.remove('revealed');
      firstCard = null;
      lock = false;
    }, 900);
  }
  updateStatus();
}

function updateStatus(){
  const elapsed = startTime ? ((Date.now()-startTime)/1000)|0 : 0;
  statusEl.textContent = `Pairs: ${matches}/${totalPairs}  Moves: ${moves}  Time: ${elapsed}s`;
}

function tick(){
  updateStatus();
  timerId = requestAnimationFrame(tick);
}

function startGame(){
  startConsonantGame();
}

function startConsonantGame(){
  console.log('Starting consonant game with group selection:', groupSelect.value);
  currentMode = 'consonants';
  cancelAnimationFrame(timerId);
  matches = 0; moves = 0; firstCard = null; lock=false;
  
  let chosen;
  
  if (groupSelect.value === 'custom') {
    // Use custom size with random selection
    let n = parseInt(deckSizeEl.value, 10);
    if (isNaN(n) || n < 2) {
      n = 2;
      deckSizeEl.value = 2;
    } else if (n > CONSONANTS.length) {
      n = CONSONANTS.length;
      deckSizeEl.value = CONSONANTS.length;
    }
    chosen = sample(CONSONANTS, n);
  } else {
    // Use frequency group
    const groupKey = groupSelect.value.replace('group', 'Group ') + ':';
    const groupName = Object.keys(FREQUENCY_GROUPS).find(key => key.startsWith(groupKey.replace(':', '')));
    
    if (groupName) {
      chosen = FREQUENCY_GROUPS[groupName];
      console.log(`Using ${groupName}:`, chosen.map(c => c[0]));
    } else {
      // Fallback to Group 1 if something goes wrong
      chosen = FREQUENCY_GROUPS['Group 1: Super Common (25%+)'];
    }
  }
  
  console.log('Chosen consonants:', chosen.length);
  const pairs = buildPairs(chosen, 'consonants');
  console.log('Generated pairs:', pairs.length);
  totalPairs = pairs.length / 2;
  const full = shuffle(pairs);
  render(full);
  startTime = Date.now();
  updateStatus();
  tick();
}

function startVowelGame(){
  console.log('Starting vowel game with group selection:', vowelGroupSelect.value);
  currentMode = 'vowels';
  cancelAnimationFrame(timerId);
  matches = 0; moves = 0; firstCard = null; lock=false;
  
  let chosen;
  
  if (vowelGroupSelect.value === 'vowelCustom') {
    // Use custom size with random selection
    let n = parseInt(vowelDeckSizeEl.value, 10);
    if (isNaN(n) || n < 2) {
      n = 2;
      vowelDeckSizeEl.value = 2;
    } else if (n > ALL_VOWELS.length) {
      n = ALL_VOWELS.length;
      vowelDeckSizeEl.value = ALL_VOWELS.length;
    }
    chosen = sample(ALL_VOWELS, n);
  } else {
    // Use vowel group
    const groupKey = vowelGroupSelect.value.replace('group', 'Group ') + ':';
    const groupName = Object.keys(VOWEL_GROUPS).find(key => key.startsWith(groupKey.replace(':', '')));
    
    if (groupName) {
      chosen = VOWEL_GROUPS[groupName];
      console.log(`Using ${groupName}:`, chosen.map(v => v[0]));
    } else {
      // Fallback to Group 1 if something goes wrong
      chosen = VOWEL_GROUPS['Group 1: Basic Monophthongs (1-8)'];
    }
  }
  
  console.log('Chosen vowels:', chosen.length);
  const pairs = buildPairs(chosen, 'vowels');
  console.log('Generated pairs:', pairs.length);
  totalPairs = pairs.length / 2;
  const full = shuffle(pairs);
  render(full);
  startTime = Date.now();
  updateStatus();
  tick();
}

function endGame(){
  cancelAnimationFrame(timerId);
  const totalTime = ((Date.now()-startTime)/1000).toFixed(1);
  const efficiency = ((totalPairs / moves) * 100).toFixed(0);
  
  statusEl.textContent += `  ✅ Done in ${totalTime}s`;
  
  // Show victory modal with stats
  victoryMessage.innerHTML = `
    <strong>Excellent work!</strong><br>
    You matched all ${totalPairs} pairs in <strong>${totalTime} seconds</strong><br>
    with <strong>${moves} moves</strong> (${efficiency}% efficiency)
  `;
  
  victoryModal.classList.add('show');
  
  if('vibrate' in navigator){
    navigator.vibrate(200);
  }
}

// Writing Practice Functions
function updateWritingGroupOptions() {
  // Make sure elements exist
  const typeSelect = document.getElementById('writingTypeSelect');
  const groupSelect = document.getElementById('writingGroupSelect');

  if (!typeSelect || !groupSelect) return;

  const writingType = typeSelect.value;

  groupSelect.innerHTML = '';

  if (writingType === 'consonants') {
    // FREQUENCY_GROUPS keys already contain the label; values are arrays of consonant entries
    Object.keys(FREQUENCY_GROUPS).forEach(key => {
      const arr = FREQUENCY_GROUPS[key];
      if (!Array.isArray(arr)) return; // safety
      const opt = document.createElement('option');
      opt.value = key; // full descriptive key
      opt.textContent = `${key} (${arr.length} chars)`;
      groupSelect.appendChild(opt);
    });
  } else {
    // VOWEL_GROUPS values are arrays of vowel entries
    Object.keys(VOWEL_GROUPS).forEach(key => {
      const arr = VOWEL_GROUPS[key];
      if (!Array.isArray(arr)) return;
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = `${key} (${arr.length} vowels)`;
      groupSelect.appendChild(opt);
    });
  }

  // Select first option by default if available
  if (groupSelect.options.length > 0) {
    groupSelect.selectedIndex = 0;
  }
}

function startWritingPractice() {
  const writingType = writingTypeSelect.value;
  const groupKey = writingGroupSelect.value;

  if (writingType === 'consonants') {
    const groupArr = FREQUENCY_GROUPS[groupKey];
    if (!Array.isArray(groupArr)) return;
    writingCharacters = groupArr.map(entry => {
      const [char, nameThai, nameRom] = entry; // entry structure: [char, thaiName, romanized, init, final]
      return { char, nameThai, nameRom, type: 'consonant' };
    });
  } else {
    const groupArr = VOWEL_GROUPS[groupKey];
    if (!Array.isArray(groupArr)) return;
    writingCharacters = groupArr.map(entry => {
      const [char, thaiName, romanization] = entry; // vowel entry structure
      return { char, nameThai: thaiName, nameRom: romanization, type: 'vowel' };
    });
  }

  writingCharacters = shuffle([...writingCharacters]);
  currentCharacterIndex = 0;
  showCharacterDisplay();
}

function showCharacterDisplay() {
  if (currentCharacterIndex >= writingCharacters.length) {
    // Practice complete
    alert('🎉 Great job! You\'ve practiced all characters in this group!');
    resetWritingPractice();
    return;
  }
  
  currentCharacter = writingCharacters[currentCharacterIndex];
  
  document.getElementById('display-character').textContent = currentCharacter.char;
  document.getElementById('display-romanization').textContent = currentCharacter.nameRom;
  document.getElementById('display-thai-name').textContent = currentCharacter.nameThai;
  
  // Play audio when showing the character
  const audioMode = currentCharacter.type === 'consonant' ? 'consonants' : 'vowels';
  playAudio(currentCharacter.char, audioMode);
  
  // Show character display phase
  characterDisplay.style.display = 'block';
  drawingPhase.style.display = 'none';
  resultPhase.style.display = 'none';
}

function startDrawing() {
  document.getElementById('prompt-character').textContent = currentCharacter.char;
  
  // Initialize canvas
  if (!ctx) {
    ctx = drawingCanvas.getContext('2d');
    resultCtx = resultCanvas.getContext('2d');
  }
  
  clearCanvas();
  
  // Show drawing phase
  characterDisplay.style.display = 'none';
  drawingPhase.style.display = 'block';
  resultPhase.style.display = 'none';
  
  setupCanvasEvents();
}

function setupCanvasEvents() {
  // Mouse events
  drawingCanvas.addEventListener('mousedown', startDrawingMouse);
  drawingCanvas.addEventListener('mousemove', drawMouse);
  drawingCanvas.addEventListener('mouseup', stopDrawing);
  drawingCanvas.addEventListener('mouseout', stopDrawing);
  
  // Touch events for mobile
  drawingCanvas.addEventListener('touchstart', startDrawingTouch);
  drawingCanvas.addEventListener('touchmove', drawTouch);
  drawingCanvas.addEventListener('touchend', stopDrawing);
  drawingCanvas.addEventListener('touchcancel', stopDrawing);
}

function startDrawingMouse(e) {
  isDrawing = true;
  const rect = drawingCanvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
}

function startDrawingTouch(e) {
  e.preventDefault();
  isDrawing = true;
  const rect = drawingCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;
}

function drawMouse(e) {
  if (!isDrawing) return;
  
  const rect = drawingCanvas.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;
  
  draw(currentX, currentY);
}

function drawTouch(e) {
  e.preventDefault();
  if (!isDrawing) return;
  
  const rect = drawingCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  const currentX = touch.clientX - rect.left;
  const currentY = touch.clientY - rect.top;
  
  draw(currentX, currentY);
}

function draw(currentX, currentY) {
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();
  
  lastX = currentX;
  lastY = currentY;
}

function stopDrawing() {
  isDrawing = false;
}

function clearCanvas() {
  ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

function finishDrawing() {
  // Copy the drawing to result canvas (smaller size)
  resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
  resultCtx.drawImage(drawingCanvas, 0, 0, drawingCanvas.width, drawingCanvas.height, 
                     0, 0, resultCanvas.width, resultCanvas.height);
  
  showResult();
}

function showResult() {
  // Show result phase
  characterDisplay.style.display = 'none';
  drawingPhase.style.display = 'none';
  resultPhase.style.display = 'block';
  
  // Display the correct character
  document.getElementById('result-character').textContent = currentCharacter.char;
  document.getElementById('result-info').innerHTML = `
    <div><strong>${currentCharacter.nameRom}</strong></div>
    <div>${currentCharacter.nameThai}</div>
  `;
  
  // Play audio again when showing the result
  const audioMode = currentCharacter.type === 'consonant' ? 'consonants' : 'vowels';
  playAudio(currentCharacter.char, audioMode);
  
  // Simple feedback (you could enhance this with actual comparison)
  const feedbackEl = document.getElementById('feedback-message');
  const feedbacks = [
    { message: "Great effort! Keep practicing to improve your strokes.", class: "feedback-good" },
    { message: "Good try! Pay attention to the character proportions.", class: "feedback-okay" },
    { message: "Nice work! Practice makes perfect.", class: "feedback-good" }
  ];
  
  const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
  feedbackEl.textContent = randomFeedback.message;
  feedbackEl.className = `feedback-message ${randomFeedback.class}`;
}

function nextCharacter() {
  currentCharacterIndex++;
  showCharacterDisplay();
}

function practiceAgain() {
  showCharacterDisplay();
}

function resetWritingPractice() {
  characterDisplay.style.display = 'block';
  drawingPhase.style.display = 'none';
  resultPhase.style.display = 'none';
  writingCharacters = [];
  currentCharacterIndex = 0;
  currentCharacter = null;
}

newGameBtn.addEventListener('click', startConsonantGame);
newVowelGameBtn.addEventListener('click', startVowelGame);

// Writing practice event listeners
writingTypeSelect.addEventListener('change', updateWritingGroupOptions);
startWritingBtn.addEventListener('click', startWritingPractice);
startDrawingBtn.addEventListener('click', startDrawing);
replayAudioBtn.addEventListener('click', () => {
  if (currentCharacter) {
    const audioMode = currentCharacter.type === 'consonant' ? 'consonants' : 'vowels';
    playAudio(currentCharacter.char, audioMode);
  }
});
clearCanvasBtn.addEventListener('click', clearCanvas);
doneDrawingBtn.addEventListener('click', finishDrawing);
nextCharacterBtn.addEventListener('click', nextCharacter);
practiceAgainBtn.addEventListener('click', practiceAgain);

// Tab switching
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
    // If switching to writing tab, ensure groups are populated
    if (btn.dataset.tab === 'writing') {
      setTimeout(() => {
        console.log('Manually calling updateWritingGroupOptions after tab switch');
        updateWritingGroupOptions();
      }, 100);
    }
  });
});

// Handle consonant group selection changes
groupSelect.addEventListener('change', () => {
  if (groupSelect.value === 'custom') {
    customSizeContainer.style.display = 'block';
  } else {
    customSizeContainer.style.display = 'none';
  }
});

// Handle vowel group selection changes
vowelGroupSelect.addEventListener('change', () => {
  if (vowelGroupSelect.value === 'vowelCustom') {
    vowelCustomSizeContainer.style.display = 'block';
  } else {
    vowelCustomSizeContainer.style.display = 'none';
  }
});

// Add input validation for deck size (only when custom is selected)
deckSizeEl.addEventListener('input', () => {
  let value = parseInt(deckSizeEl.value, 10);
  if (isNaN(value) || value < 2) {
    deckSizeEl.value = 2;
  } else if (value > CONSONANTS.length) {
    deckSizeEl.value = CONSONANTS.length;
  }
});

// Add input validation for vowel deck size
vowelDeckSizeEl.addEventListener('input', () => {
  let value = parseInt(vowelDeckSizeEl.value, 10);
  if (isNaN(value) || value < 2) {
    vowelDeckSizeEl.value = 2;
  } else if (value > ALL_VOWELS.length) {
    vowelDeckSizeEl.value = ALL_VOWELS.length;
  }
});

// Victory modal event handlers
playAgainBtn.addEventListener('click', () => {
  victoryModal.classList.remove('show');
  if (currentMode === 'consonants') {
    startConsonantGame();
  } else {
    startVowelGame();
  }
});

closeModalBtn.addEventListener('click', () => {
  victoryModal.classList.remove('show');
});

// Close modal when clicking outside
victoryModal.addEventListener('click', (e) => {
  if (e.target === victoryModal) {
    victoryModal.classList.remove('show');
  }
});

window.addEventListener('load', ()=>{
  startConsonantGame(); // Start with consonants by default
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  }
  // Initialize writing group options after everything is loaded
  updateWritingGroupOptions();
  
  // Initialize spelling practice
  initializeSpellingPractice();
});

// Spelling Practice Functionality
let spellingState = {
  currentWord: null,
  selectedLetters: [],
  availableLetters: [],
  attempts: 0,
  maxAttempts: 3,
  hintsUsed: 0
};

function initializeSpellingPractice() {
  const spellingTab = document.getElementById('spelling-tab');
  if (!spellingTab) return;

  // Get DOM elements
  const newWordBtn = document.getElementById('new-word-btn');
  const playWordBtn = document.getElementById('play-word-btn');
  const hintBtn = document.getElementById('hint-btn');
  const clearBtn = document.getElementById('clear-btn');
  const checkBtn = document.getElementById('check-btn');
  const nextWordBtn = document.getElementById('next-word-btn');
  const retryBtn = document.getElementById('retry-btn');

  // Add event listeners
  if (newWordBtn) newWordBtn.addEventListener('click', startNewSpellingWord);
  if (playWordBtn) playWordBtn.addEventListener('click', playCurrentWord);
  if (hintBtn) hintBtn.addEventListener('click', showSpellingHint);
  if (clearBtn) clearBtn.addEventListener('click', clearSpelling);
  if (checkBtn) checkBtn.addEventListener('click', checkSpelling);
  if (nextWordBtn) nextWordBtn.addEventListener('click', startNewSpellingWord);
  if (retryBtn) retryBtn.addEventListener('click', retryCurrentWord);
}

function startNewSpellingWord() {
  // Choose a random word from the database
  const words = Object.values(THAI_WORDS).flat();
  spellingState.currentWord = words[Math.floor(Math.random() * words.length)];
  spellingState.selectedLetters = [];
  spellingState.attempts = 0;
  spellingState.hintsUsed = 0;

  // Update display
  updateSpellingDisplay();
  setupSpellingLetters();
  playCurrentWord();

  // Show game interface, hide result
  document.getElementById('spelling-game').style.display = 'block';
  document.getElementById('spelling-result').style.display = 'none';
}

function updateSpellingDisplay() {
  const wordPrompt = document.getElementById('word-prompt');
  const wordMeaning = document.getElementById('word-meaning');
  
  if (spellingState.currentWord) {
    wordPrompt.textContent = 'Listen and spell the word:';
    wordMeaning.textContent = `"${spellingState.currentWord.meaning}"`;
  }
}

function setupSpellingLetters() {
  if (!spellingState.currentWord) return;

  // Get the correct letters for this word
  const correctLetters = getWordLetters(spellingState.currentWord.thai);
  
  // Create distractors (wrong letters)
  const distractors = createDistractors(correctLetters, 8);
  
  // Combine and shuffle
  spellingState.availableLetters = [...correctLetters, ...distractors]
    .sort(() => Math.random() - 0.5);

  // Render available letters
  renderAvailableLetters();
  
  // Clear construction area
  renderSelectedLetters();
}

function renderAvailableLetters() {
  const container = document.getElementById('available-letters');
  if (!container) return;

  container.innerHTML = '';
  
  spellingState.availableLetters.forEach((letter, index) => {
    const tile = document.createElement('div');
    tile.className = 'letter-tile';
    tile.textContent = letter;
    tile.dataset.index = index;
    tile.addEventListener('click', () => selectLetter(index));
    container.appendChild(tile);
  });
}

function renderSelectedLetters() {
  const container = document.getElementById('selected-letters');
  if (!container) return;

  container.innerHTML = '';
  
  if (spellingState.selectedLetters.length === 0) {
    container.innerHTML = '<div style="color: #666; font-style: italic;">Click letters to build the word</div>';
    return;
  }

  spellingState.selectedLetters.forEach((letter, index) => {
    const tile = document.createElement('div');
    tile.className = 'letter-tile selected';
    tile.textContent = letter;
    tile.dataset.index = index;
    tile.addEventListener('click', () => removeLetter(index));
    container.appendChild(tile);
  });
}

function selectLetter(index) {
  const letter = spellingState.availableLetters[index];
  
  // Add to selected letters
  spellingState.selectedLetters.push(letter);
  
  // Remove from available letters
  spellingState.availableLetters.splice(index, 1);
  
  // Re-render
  renderAvailableLetters();
  renderSelectedLetters();
}

function removeLetter(index) {
  const letter = spellingState.selectedLetters[index];
  
  // Remove from selected letters
  spellingState.selectedLetters.splice(index, 1);
  
  // Add back to available letters
  spellingState.availableLetters.push(letter);
  
  // Re-render
  renderAvailableLetters();
  renderSelectedLetters();
}

function clearSpelling() {
  // Move all selected letters back to available
  spellingState.availableLetters.push(...spellingState.selectedLetters);
  spellingState.selectedLetters = [];
  
  // Re-render
  renderAvailableLetters();
  renderSelectedLetters();
}

function showSpellingHint() {
  if (!spellingState.currentWord || spellingState.hintsUsed >= 2) return;
  
  const correctLetters = getWordLetters(spellingState.currentWord.thai);
  const hintIndex = spellingState.hintsUsed;
  
  if (hintIndex < correctLetters.length) {
    const hintLetter = correctLetters[hintIndex];
    
    // Find this letter in available letters and highlight it
    const letterTiles = document.querySelectorAll('#available-letters .letter-tile');
    letterTiles.forEach(tile => {
      if (tile.textContent === hintLetter && !tile.classList.contains('disabled')) {
        tile.style.background = '#ff9800';
        tile.style.border = '3px solid #f57c00';
        setTimeout(() => {
          tile.style.background = '';
          tile.style.border = '';
        }, 2000);
      }
    });
    
    spellingState.hintsUsed++;
    
    // Disable hint button if max hints used
    if (spellingState.hintsUsed >= 2) {
      document.getElementById('hint-btn').disabled = true;
    }
  }
}

function checkSpelling() {
  if (!spellingState.currentWord || spellingState.selectedLetters.length === 0) return;
  
  const userSpelling = spellingState.selectedLetters.join('');
  const correctSpelling = spellingState.currentWord.thai;
  
  spellingState.attempts++;
  
  // Show result
  showSpellingResult(userSpelling, correctSpelling);
}

function showSpellingResult(userSpelling, correctSpelling) {
  // Hide game interface
  document.getElementById('spelling-game').style.display = 'none';
  
  // Show result interface
  const resultDiv = document.getElementById('spelling-result');
  resultDiv.style.display = 'block';
  
  // Update result displays
  document.getElementById('your-spelling-display').textContent = userSpelling;
  document.getElementById('correct-spelling-display').textContent = correctSpelling;
  
  // Update feedback
  const feedbackDiv = document.getElementById('spelling-feedback');
  const isCorrect = userSpelling === correctSpelling;
  
  if (isCorrect) {
    feedbackDiv.className = 'spelling-feedback feedback-correct';
    feedbackDiv.innerHTML = `
      <h3>✅ Excellent!</h3>
      <p>You spelled "${correctSpelling}" correctly!</p>
      <p>Meaning: "${spellingState.currentWord.meaning}"</p>
    `;
  } else {
    feedbackDiv.className = 'spelling-feedback feedback-incorrect';
    const explanation = getSpellingExplanation(userSpelling, correctSpelling);
    feedbackDiv.innerHTML = `
      <h3>❌ Not quite right</h3>
      <p>The correct spelling is "${correctSpelling}"</p>
      <p>Meaning: "${spellingState.currentWord.meaning}"</p>
      ${explanation ? `<p class="spelling-explanation">${explanation}</p>` : ''}
    `;
  }
}

function getSpellingExplanation(userSpelling, correctSpelling) {
  if (userSpelling.length !== correctSpelling.length) {
    return "Thai words have specific vowel positions. Some vowels appear before, after, above, or below consonants.";
  }
  
  let differences = 0;
  for (let i = 0; i < correctSpelling.length; i++) {
    if (userSpelling[i] !== correctSpelling[i]) {
      differences++;
    }
  }
  
  if (differences === 1) {
    return "You're very close! Check the vowel positioning carefully.";
  } else if (differences <= 2) {
    return "Good attempt! Remember that Thai vowels can appear in different positions around consonants.";
  } else {
    return "Listen to the pronunciation again and pay attention to each sound.";
  }
}

function playCurrentWord() {
  if (spellingState.currentWord && spellingState.currentWord.audio) {
    playAudio(spellingState.currentWord.audio);
  }
}

function retryCurrentWord() {
  // Reset the current word without choosing a new one
  spellingState.selectedLetters = [];
  spellingState.attempts = 0;
  spellingState.hintsUsed = 0;
  
  // Re-setup the interface
  setupSpellingLetters();
  
  // Show game interface, hide result
  document.getElementById('spelling-game').style.display = 'block';
  document.getElementById('spelling-result').style.display = 'none';
  
  // Re-enable hint button
  const hintBtn = document.getElementById('hint-btn');
  if (hintBtn) hintBtn.disabled = false;
}

// Remove resize handler since CSS media queries now handle responsive layout
