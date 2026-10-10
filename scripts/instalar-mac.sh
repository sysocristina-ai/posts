#!/usr/bin/env bash
# Instala Node.js, FFmpeg y las dependencias de Remotion en macOS.
set -euo pipefail

if ! command -v brew >/dev/null 2>&1; then
  echo "Instalando Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null || /usr/local/bin/brew shellenv)"
fi

command -v node >/dev/null 2>&1 || brew install node
command -v ffmpeg >/dev/null 2>&1 || brew install ffmpeg

cd "$(dirname "$0")/../video"
npm install
npx remotion browser ensure

echo
node -v
ffmpeg -version | head -1
echo "Listo. Abre el editor con:  cd video && npm run studio"
