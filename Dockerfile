# ─── Divanü Lügati't-Türk ─────────────────────────────────────────────────────
# Node.js 22 Alpine (küçük imaj)
FROM node:22-alpine

# Çalışma dizini
WORKDIR /app

# Proje dosyalarını kopyala
COPY index.html   ./
COPY server.js    ./
COPY css/         ./css/
COPY js/          ./js/
COPY data/        ./data/

# Port aç
EXPOSE 3000

# server.js çalıştır
CMD ["node", "server.js"]
