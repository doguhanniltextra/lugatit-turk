/* =========================================================
   map.js — Türk Boyları Coğrafyası (Leaflet.js)
   ========================================================= */

'use strict';

function initMap() {
  const container = document.getElementById('boylar-map');
  if (!container) return;

  // ── Harita oluştur ─────────────────────────────────────
  // Orta Asya merkezli, 11. yüzyıl Türk dünyasını kapsayan zoom
  const map = L.map('boylar-map', {
    center: [43, 62],
    zoom: 4,
    zoomControl: true,
    scrollWheelZoom: false,
  });

  // Popup açılınca haritanın otomatik kaymasını engelle
  map.on('popupopen', function(e) {
    map.setView(map.getCenter(), map.getZoom(), { animate: false });
  });

  // CartoDB Dark Matter — ücretsiz, dark tema
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // ── Coğrafi Veriler ────────────────────────────────────
  // Türk boylarının 11. yüzyıldaki yaklaşık toprakları
  const tribes = [
    {
      name: 'Oguz / Turkmen',
      lat: 42, lng: 57,
      radius: 680000,
      color: '#b07040',
      info: `Oguz boyları, gunumuz Turkiye Turkcesinin dogrudan atasıdır. Aral Golu'nun batı ve guneyinde yurtlanmışlardır. Kaşgarlı Mahmud Oguz lehcesini ayrıntılı bicimde incelemiştir.`,
    },
    {
      name: 'Kıpcak',
      lat: 50, lng: 63,
      radius: 900000,
      color: '#4a7a9a',
      info: `Kıpcak boyları, Hazar'ın kuzeyinden Karadeniz'e uzanan geniş bozkırda yaşıyordu. Gunumuz Kazakca ve Kırgızcasının atası sayılırlar.`,
    },
    {
      name: 'Uygur',
      lat: 42, lng: 86,
      radius: 550000,
      color: '#7a9a4a',
      info: `Uygurlar, Tarim Havzası ve Dogu Turkistan'da guclu bir medeniyet kurmuş, zengin yazılı edebiyata sahip bir Turk boyudur.`,
    },
    {
      name: 'Cigil',
      lat: 42, lng: 74,
      radius: 300000,
      color: '#9a4a7a',
      info: `Cigiller, Fergana Vadisi ve Isık Gol cevresinde yaşıyordu. Karahanlı Devleti'nin cekirdek boylarından biridir.`,
    },
    {
      name: 'Karluk',
      lat: 44, lng: 78,
      radius: 400000,
      color: '#9a7a4a',
      info: `Karluklar, Tarım'ın kuzeyinde ve Balkаş Golu cevresinde yurtlanmıştı. Karahanlı hanedanının kurucusu sayılırlar.`,
    },
    {
      name: 'Yagma',
      lat: 40, lng: 77,
      radius: 250000,
      color: '#6a4a9a',
      info: `Yagmalar, Kaşgar cevresinde yaşıyan ve Karahanlılara baglı onemli bir boydur.`,
    },
    {
      name: 'Halac',
      lat: 36, lng: 66,
      radius: 350000,
      color: '#4a9a7a',
      info: `Halac boyları, gunumuz Afganistan topraklarında, Horasan'ın dogusunda yaşıyordu.`,
    },
  ];

  // Boyları haritaya ekle
  tribes.forEach(t => {
    const circle = L.circle([t.lat, t.lng], {
      radius: t.radius,
      color: t.color,
      weight: 1.5,
      opacity: 0.7,
      fillColor: t.color,
      fillOpacity: 0.10,
    }).addTo(map);

    circle.bindPopup(`
      <div class="map-popup">
        <strong>${t.name}</strong>
        <p>${t.info}</p>
      </div>
    `);

    // İsim etiketi
    L.marker([t.lat, t.lng], {
      icon: L.divIcon({
        className: 'tribe-label',
        html: `<span>${t.name}</span>`,
        iconSize: null,
      })
    }).addTo(map);
  });

  // ── Şehirler ───────────────────────────────────────────
  const cities = [
    {
      name: 'Kâşgar',
      lat: 39.47, lng: 75.99,
      type: 'origin',
      info: '<strong>Kâşgar</strong> — Kâşgarlı Mahmud\'un doğduğu şehir. XI. yüzyılda Karahanlı Devleti\'nin kültür ve ticaret merkezi. Bugün Çin\'in Sincan/Doğu Türkistan bölgesinde yer almaktadır.',
    },
    {
      name: 'Bağdat',
      lat: 33.34, lng: 44.40,
      type: 'written',
      info: '<strong>Bağdat</strong> — Divanü Lügati\'t-Türk\'ün 1072-1074 yılları arasında kaleme alındığı şehir. Dönemin Abbasi Hilafeti\'nin başkenti ve en önemli ilim merkeziydi.',
    },
    {
      name: 'Semerkant',
      lat: 39.65, lng: 66.97,
      type: 'city',
      info: '<strong>Semerkant</strong> — Orta Asya\'nın en büyük ticaret ve kültür merkezlerinden biri. Karahanlı döneminde Türk-İslam medeniyetinin kalbi.',
    },
    {
      name: 'Buhara',
      lat: 39.77, lng: 64.42,
      type: 'city',
      info: '<strong>Buhara</strong> — Samaniler ve Karahanlılar döneminde ilim merkezi. Birçok Türk âlimi bu şehirde yetişmiştir.',
    },
  ];

  // Şehir ikonları
  function cityIcon(type) {
    const colors = { origin: '#d4935a', written: '#6a9dbe', city: '#8a8a8a' };
    const color = colors[type] || '#8a8a8a';
    return L.divIcon({
      className: 'city-marker',
      html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.5);box-shadow:0 0 8px ${color}aa"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  }

  cities.forEach(c => {
    L.marker([c.lat, c.lng], { icon: cityIcon(c.type) })
      .addTo(map)
      .bindPopup(`<div class="map-popup">${c.info}</div>`);

    L.marker([c.lat, c.lng], {
      icon: L.divIcon({
        className: 'city-label',
        html: `<span>${c.name}</span>`,
        iconSize: null,
      })
    }).addTo(map);
  });

  // ── İpek Yolu çizgisi ──────────────────────────────────
  const silkRoad = [
    [33.34, 44.40],  // Bağdat
    [36.27, 59.60],  // Nişabur
    [39.77, 64.42],  // Buhara
    [39.65, 66.97],  // Semerkant
    [40.50, 70.00],  // Taşkent
    [39.47, 75.99],  // Kâşgar
    [42.00, 86.00],  // Uygur toprakları
  ];

  L.polyline(silkRoad, {
    color: 'rgba(176,112,64,0.35)',
    weight: 2,
    dashArray: '6, 8',
  }).addTo(map).bindPopup('<div class="map-popup"><strong>İpek Yolu</strong><p>XI. yüzyılda Türk boylarını, İslam dünyasını ve Çin\'i birbirine bağlayan ticaret güzergâhı.</p></div>');

  // Scroll ile haritayı aktif et (kullanıcı haritaya tıkladığında)
  container.addEventListener('click', () => {
    map.scrollWheelZoom.enable();
  });
  container.addEventListener('mouseleave', () => {
    map.scrollWheelZoom.disable();
  });
}

// DOM hazır olduğunda haritayı başlat
document.addEventListener('DOMContentLoaded', initMap);
