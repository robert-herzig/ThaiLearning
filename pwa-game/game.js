// Remove the import since we're using global CONSONANTS from data.js
// import { CONSONANTS } from './data.js';

const gameEl = document.getElementById('game');
const deckSizeEl = document.getElementById('deckSize');
const newGameBtn = document.getElementById('newGameBtn');
const statusEl = document.getElementById('status');

let firstCard = null;
let lock = false;
let matches = 0;
let totalPairs = 0;
let moves = 0;
let startTime = 0;
let timerId = null;

function sample(array, n){
  const arr = [...array];
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()* (i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr.slice(0,n);
}

function buildPairs(consonantTuples){
  // Each pair: one card with letter, one card with name+sounds
  const cards = [];
  consonantTuples.forEach((c, idx) => {
    const [char, nameThai, nameRom, initSound, finalSound] = c;
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
  
  // Calculate responsive grid columns based on screen size and card count
  const screenWidth = window.innerWidth;
  const cardCount = cards.length;
  let cols;
  
  if (screenWidth < 480) {
    // Mobile: 3-4 columns max
    cols = Math.min(4, Math.max(3, Math.ceil(Math.sqrt(cardCount * 0.8))));
  } else if (screenWidth < 768) {
    // Tablet: 4-6 columns
    cols = Math.min(6, Math.max(4, Math.ceil(Math.sqrt(cardCount))));
  } else {
    // Desktop: 6-8 columns
    cols = Math.min(8, Math.max(6, Math.ceil(Math.sqrt(cardCount * 1.2))));
  }
  
  gameEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  console.log('Rendered with', cols, 'columns for', cardCount, 'cards on', screenWidth, 'px screen');
}

function playAudio(consonantChar) {
  try {
    // Play audio from the local audio directory
    const audioPath = `audio/consonant_${consonantChar}_name.mp3`;
    const audio = new Audio(audioPath);
    
    audio.addEventListener('error', () => {
      console.log(`Audio file not found: ${audioPath}`);
    });
    
    audio.addEventListener('canplay', () => {
      console.log(`Playing audio for consonant: ${consonantChar}`);
    });
    
    audio.play().catch(err => {
      console.log(`Could not play audio for ${consonantChar}:`, err.message);
    });
  } catch (error) {
    console.log(`Audio playback error for ${consonantChar}:`, error.message);
  }
}

function onReveal(cardEl){
  if(lock || cardEl.classList.contains('revealed') || cardEl.classList.contains('matched')) return;
  cardEl.classList.add('revealed');
  
  // Play audio for consonant name cards when revealed
  if (cardEl.dataset.type === 'info' && cardEl.dataset.char) {
    playAudio(cardEl.dataset.char);
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
  console.log('Starting game with deck size:', deckSizeEl.value);
  console.log('CONSONANTS available:', CONSONANTS.length);
  cancelAnimationFrame(timerId);
  matches = 0; moves = 0; firstCard = null; lock=false;
  const n = parseInt(deckSizeEl.value,10);
  const chosen = sample(CONSONANTS, n);
  console.log('Chosen consonants:', chosen.length);
  const pairs = buildPairs(chosen);
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
  statusEl.textContent += `  ✅ Done in ${totalTime}s`;
  if('vibrate' in navigator){
    navigator.vibrate(200);
  }
}

newGameBtn.addEventListener('click', startGame);
window.addEventListener('load', ()=>{
  startGame();
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  }
});

// Recalculate grid on resize/orientation change
window.addEventListener('resize', () => {
  const cards = Array.from(gameEl.children);
  if (cards.length > 0) {
    const cardCount = cards.length;
    const screenWidth = window.innerWidth;
    let cols;
    
    if (screenWidth < 480) {
      cols = Math.min(4, Math.max(3, Math.ceil(Math.sqrt(cardCount * 0.8))));
    } else if (screenWidth < 768) {
      cols = Math.min(6, Math.max(4, Math.ceil(Math.sqrt(cardCount))));
    } else {
      cols = Math.min(8, Math.max(6, Math.ceil(Math.sqrt(cardCount * 1.2))));
    }
    
    gameEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  }
});
