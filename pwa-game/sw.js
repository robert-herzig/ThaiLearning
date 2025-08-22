const CACHE_NAME = 'thai-match-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './game.js',
  './data.js',
  './manifest.webmanifest',
  // Add audio files to cache
  './audio/consonant_ก_name.mp3',
  './audio/consonant_ข_name.mp3',
  './audio/consonant_ฃ_name.mp3',
  './audio/consonant_ค_name.mp3',
  './audio/consonant_ฅ_name.mp3',
  './audio/consonant_ฆ_name.mp3',
  './audio/consonant_ง_name.mp3',
  './audio/consonant_จ_name.mp3',
  './audio/consonant_ฉ_name.mp3',
  './audio/consonant_ช_name.mp3',
  './audio/consonant_ซ_name.mp3',
  './audio/consonant_ฌ_name.mp3',
  './audio/consonant_ญ_name.mp3',
  './audio/consonant_ฎ_name.mp3',
  './audio/consonant_ฏ_name.mp3',
  './audio/consonant_ฐ_name.mp3',
  './audio/consonant_ฑ_name.mp3',
  './audio/consonant_ฒ_name.mp3',
  './audio/consonant_ณ_name.mp3',
  './audio/consonant_ด_name.mp3',
  './audio/consonant_ต_name.mp3',
  './audio/consonant_ถ_name.mp3',
  './audio/consonant_ท_name.mp3',
  './audio/consonant_ธ_name.mp3',
  './audio/consonant_น_name.mp3',
  './audio/consonant_บ_name.mp3',
  './audio/consonant_ป_name.mp3',
  './audio/consonant_ผ_name.mp3',
  './audio/consonant_ฝ_name.mp3',
  './audio/consonant_พ_name.mp3',
  './audio/consonant_ฟ_name.mp3',
  './audio/consonant_ภ_name.mp3',
  './audio/consonant_ม_name.mp3',
  './audio/consonant_ย_name.mp3',
  './audio/consonant_ร_name.mp3',
  './audio/consonant_ล_name.mp3',
  './audio/consonant_ว_name.mp3',
  './audio/consonant_ศ_name.mp3',
  './audio/consonant_ษ_name.mp3',
  './audio/consonant_ส_name.mp3',
  './audio/consonant_ห_name.mp3',
  './audio/consonant_ฬ_name.mp3',
  './audio/consonant_อ_name.mp3',
  './audio/consonant_ฮ_name.mp3'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if(url.origin === location.origin){
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request))
    );
  }
});
