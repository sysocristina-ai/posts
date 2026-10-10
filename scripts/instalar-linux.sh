#!/usr/bin/env bash
# Instala Node.js, FFmpeg y las dependencias de Remotion en Ubuntu/Debian.
set -euo pipefail

# Remotion necesita Node.js 18 o superior
if ! command -v node >/dev/null 2>&1 || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 18 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# FFmpeg y librerías que necesita el Chrome headless de Remotion
sudo apt-get update
sudo apt-get install -y ffmpeg libnss3 libdbus-1-3 libatk1.0-0 libgbm-dev \
  libasound2t64 libxrandr2 libxkbcommon-dev libxfixes3 libxcomposite1 \
  libxdamage1 libatk-bridge2.0-0 libpango-1.0-0 libcairo2 libcups2 \
  || sudo apt-get install -y ffmpeg libnss3 libgbm-dev libasound2

cd "$(dirname "$0")/../video"
npm install
npx remotion browser ensure

echo
node -v
ffmpeg -version | head -1
echo "Listo. Abre el editor con:  cd video && npm run studio"
