/* =========================================================
   Divanü Lügati't-Türk — Uygulama Mantığı (app.js)
   
   Bağımlılık: data/words.json (fetch ile yüklenir)
   ========================================================= */

'use strict';

// ─── Durum ───────────────────────────────────────────────
let sel = null;  // Seçili sözcük kimliği
let D   = [];    // Tüm veri (words.json'dan)

// ─── Filtreleme ───────────────────────────────────────────
/**
 * Arama sorgusuna göre sözcükleri filtreler.
 *
 * Sözdizimi:
 *   -mak   → "mak" ile BİTEN sözcükler
 *   aç-    → "aç" ile BAŞLAYAN sözcükler
 *   at     → hem sözcükte hem anlamda geçen
 *
 * @param {string} q - Arama sorgusu
 * @returns {Array} Eşleşen girişler
 */
function filt(q) {
  if (!q || q.trim() === '') return D.slice(0, 200);

  const r = q.trim().toLowerCase();

  // "-mak" → ile biten
  if (r.startsWith('-') && r.length > 1) {
    const s = r.slice(1);
    return D.filter(x => x.w.toLowerCase().endsWith(s));
  }

  // "aç-" → ile başlayan
  if (r.endsWith('-') && r.length > 1) {
    const s = r.slice(0, -1);
    return D.filter(x => x.w.toLowerCase().startsWith(s));
  }

  // Genel: sözcük veya anlamda geçen
  return D.filter(x =>
    x.w.toLowerCase().includes(r) ||
    x.m.toLowerCase().includes(r)
  );
}

// ─── Liste Gösterimi ──────────────────────────────────────
/**
 * Filtrelenmiş sonuçları sol panele render eder.
 * Güvenlik için textContent kullanır (XSS önlemi).
 *
 * @param {Array} res - Gösterilecek girişler
 */
function show(res) {
  const ul = document.getElementById('wl');
  document.getElementById('rc').textContent = res.length.toLocaleString('tr');
  ul.innerHTML = '';

  if (!res.length) {
    const li  = document.createElement('li');
    const div = document.createElement('div');
    div.className   = 'nr';
    div.textContent = 'Sonuç bulunamadı';
    li.appendChild(div);
    ul.appendChild(li);
    return;
  }

  const fr = document.createDocumentFragment();
  res.slice(0, 400).forEach(entry => {
    const li  = document.createElement('li');
    if (entry.w === sel) li.classList.add('act');

    const btn = document.createElement('button');

    const spanW = document.createElement('span');
    spanW.className   = 'ww';
    spanW.textContent = entry.w;

    const spanM = document.createElement('span');
    spanM.className   = 'wm';
    spanM.textContent = entry.m.slice(0, 48);

    btn.appendChild(spanW);
    btn.appendChild(spanM);
    btn.addEventListener('click', () => pick(entry.w));

    li.appendChild(btn);
    fr.appendChild(li);
  });

  ul.appendChild(fr);
}

// ─── Sözcük Seçimi ────────────────────────────────────────
/**
 * Seçilen sözcüğün detayını sağ panelde gösterir.
 *
 * @param {string} word - Seçilen sözcük
 */
function pick(word) {
  sel = word;
  const entry = D.find(x => x.w === word);
  if (!entry) return;

  // Listeyi güncelle (aktif öğeyi işaretle)
  show(filt(document.getElementById('q').value));

  // Detay panelini oluştur (XSS güvenliği: textContent)
  const dp = document.getElementById('dp');
  dp.innerHTML = '';

  const dc = document.createElement('div');
  dc.className = 'dc';

  const headword = document.createElement('div');
  headword.className   = 'dw';
  headword.textContent = entry.w;

  const divider = document.createElement('div');
  divider.className = 'dd';

  const meaning = document.createElement('div');
  meaning.className   = 'dm';
  meaning.textContent = entry.m;

  const source = document.createElement('div');
  source.className   = 'dn';
  source.textContent = 'Divanü L\u00fcgati\u2019t-T\u00fcrk \u00b7 K\u00e2\u015fgarl\u0131 Mahmud \u00b7 XI. y\u00fczy\u0131l';

  dc.appendChild(headword);
  dc.appendChild(divider);
  dc.appendChild(meaning);
  dc.appendChild(source);
  dp.appendChild(dc);
}

// ─── Olay Dinleyicileri ───────────────────────────────────
function initEvents() {
  const inp = document.getElementById('q');
  const cb  = document.getElementById('cb');

  inp.addEventListener('input', e => {
    cb.style.display = e.target.value ? 'block' : 'none';
    show(filt(e.target.value));
  });

  cb.addEventListener('click', () => {
    inp.value = '';
    cb.style.display = 'none';
    show(filt(''));
    inp.focus();
  });
}

// ─── Başlatma ─────────────────────────────────────────────
/**
 * Veriyi words.json'dan yükler ve uygulamayı başlatır.
 */
async function init() {
  try {
    const res = await fetch('data/words.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    D = await res.json();

    // Badge'i gerçek sözcük sayısıyla güncelle
    const badge = document.querySelector('.badge');
    if (badge) badge.textContent = D.length.toLocaleString('tr') + ' Sözcük';

    initEvents();
    show(filt(''));
  } catch (err) {
    console.error('Veri yüklenemedi:', err);
    const dp = document.getElementById('dp');
    if (dp) {
      dp.innerHTML = '';
      const de  = document.createElement('div');
      de.className = 'de';
      const ic  = document.createElement('span');
      ic.className   = 'ic';
      ic.textContent = '⚠';
      const msg = document.createElement('span');
      msg.textContent = 'Veri yüklenemedi — sunucu çalışıyor mu? (node server.js)';
      de.appendChild(ic);
      de.appendChild(msg);
      dp.appendChild(de);
    }
  }
}

// DOM hazır olduğunda başlat
document.addEventListener('DOMContentLoaded', () => {
  init();
  initBioSpeech();
});

// ─── Web Speech API — Biyografi Sesli Anlatım ────────────────
function initBioSpeech() {
  const btn = document.getElementById('listenBtn');
  if (!btn) return;

  // Web Speech API destekleniyor mu?
  if (!('speechSynthesis' in window)) {
    btn.title = 'Tarayıcınız sesli okumayı desteklemiyor';
    btn.style.opacity = '0.4';
    btn.style.cursor = 'not-allowed';
    return;
  }

  // Okunacak metin: bioText içindeki tüm paragrafları birleştir
  function getBioText() {
    const el = document.getElementById('bioText');
    if (!el) return '';
    return [...el.querySelectorAll('p')]
      .map(p => p.textContent.trim())
      .join(' ');
  }

  let utterance = null;

  btn.addEventListener('click', () => {
    const synth = window.speechSynthesis;

    // Çalışıyorsa durdur
    if (synth.speaking) {
      synth.cancel();
      btn.classList.remove('playing');
      btn.querySelector('.listen-label').textContent = 'Dinle';
      return;
    }

    // Yeni konuşma oluştur
    const text = getBioText();
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = 'tr-TR';
    utterance.rate  = 0.92;   // biraz yavaş — anlamlı
    utterance.pitch = 1.0;

    // Türkçe ses seç — varsa
    function pickVoice() {
      const voices = synth.getVoices();
      const tr = voices.find(v => v.lang.startsWith('tr'));
      if (tr) utterance.voice = tr;
    }
    pickVoice();
    // Bazı tarayıcılarda getVoices() async yüklenir
    if (synth.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', pickVoice, { once: true });
    }

    utterance.onstart = () => {
      btn.classList.add('playing');
      btn.querySelector('.listen-label').textContent = 'Durdur';
    };
    utterance.onend = utterance.onerror = () => {
      btn.classList.remove('playing');
      btn.querySelector('.listen-label').textContent = 'Dinle';
    };

    synth.speak(utterance);
  });
}