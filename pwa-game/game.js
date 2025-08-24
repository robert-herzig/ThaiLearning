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
    statusEl.textContent = '';
    updateWritingGroupOptions(); // Update group options when switching to writing
  } else {
    gameEl.style.display = 'grid';
    writingPracticeEl.style.display = 'none';
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
  const writingType = writingTypeSelect.value;
  const groupSelect = writingGroupSelect;
  
  if (!writingType || !groupSelect) {
    console.error('Writing elements not found:', { writingType, groupSelect });
    return;
  }
  
  groupSelect.innerHTML = '';
  
  if (writingType === 'consonants') {
    Object.keys(FREQUENCY_GROUPS).forEach(groupKey => {
      const group = FREQUENCY_GROUPS[groupKey];
      const option = document.createElement('option');
      option.value = groupKey;
      option.textContent = `${groupKey.replace('group', 'Group ')}: ${group.name} (${group.chars.length} chars)`;
      groupSelect.appendChild(option);
    });
  } else {
    Object.keys(VOWEL_GROUPS).forEach(groupKey => {
      const group = VOWEL_GROUPS[groupKey];
      const option = document.createElement('option');
      option.value = groupKey;
      option.textContent = `${groupKey.replace('group', 'Group ')}: ${group.name} (${group.chars.length} vowels)`;
      groupSelect.appendChild(option);
    });
  }
  
  console.log(`Updated writing groups for ${writingType}:`, groupSelect.children.length, 'options');
}

function startWritingPractice() {
  const writingType = writingTypeSelect.value;
  const groupKey = writingGroupSelect.value;
  
  if (writingType === 'consonants') {
    const group = FREQUENCY_GROUPS[groupKey];
    writingCharacters = group.chars.map(char => {
      const consonantData = CONSONANTS.find(c => c[0] === char);
      return {
        char: char,
        nameThai: consonantData[1],
        nameRom: consonantData[2],
        type: 'consonant'
      };
    });
  } else {
    const group = VOWEL_GROUPS[groupKey];
    writingCharacters = group.chars.map(char => {
      const vowelData = ALL_VOWELS.find(v => v[0] === char);
      return {
        char: char,
        nameThai: vowelData[1],
        nameRom: vowelData[2],
        type: 'vowel'
      };
    });
  }
  
  // Shuffle the characters for random practice
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
clearCanvasBtn.addEventListener('click', clearCanvas);
doneDrawingBtn.addEventListener('click', finishDrawing);
nextCharacterBtn.addEventListener('click', nextCharacter);
practiceAgainBtn.addEventListener('click', practiceAgain);

// Tab switching
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
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
});

// Remove resize handler since CSS media queries now handle responsive layout
