// Migrasi localStorage 8081 -> 3000
// Karena AsyncStorage web = localStorage per port, data 8081 tidak otomatis ada di 3000.
// Cara pakai:
// 1. Buka http://localhost:8081 (port lama) -> F12 -> Console -> paste EXPORT snippet -> copy output
// 2. Buka http://localhost:3000 (port baru) -> F12 -> Console -> paste IMPORT snippet (ganti PASTE_JSON)

// === EXPORT (jalankan di 8081) ===
(() => {
  const keys = ['babyops_users_v1','babyops_current_v1'];
  // ambil semua history juga
  for (let i=0;i<localStorage.length;i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('babyops_history_')) keys.push(k);
  }
  const data = {};
  keys.forEach(k => data[k] = localStorage.getItem(k));
  console.log('=== COPY JSON INI ===');
  console.log(JSON.stringify(data));
  copy(JSON.stringify(data)); // auto copy di Chrome
  console.log('Tercopy ke clipboard!');
})();

// === IMPORT (jalankan di 3000, ganti PASTE_JSON dengan hasil export) ===
// const PASTE_JSON = '...'; 
// const data = JSON.parse(PASTE_JSON);
// Object.entries(data).forEach(([k,v]) => { if(v!==null) localStorage.setItem(k,v); });
// location.reload();
