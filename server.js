/**
 * Divanü Lügati't-Türk — Yerel Geliştirme Sunucusu
 * 
 * Kullanım: node server.js
 * Sonra: http://localhost:3000 adresini açın
 */

const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css; charset=utf-8',
  '.js'  : 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg' : 'image/svg+xml',
  '.ico' : 'image/x-icon',
  '.png' : 'image/png',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  // Güvenlik: path traversal önlemi
  const filePath = path.join(ROOT, path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, ''));
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? '404 Not Found' : '500 Server Error');
      return;
    }
    // CORS başlığı (geliştirme için)
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  Divanü Lügati't-Türk çalışıyor:`);
  console.log(`  http://localhost:${PORT}\n`);
  console.log(`  Durdurmak için Ctrl+C\n`);
});
