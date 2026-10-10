# Instala Node.js, FFmpeg y las dependencias de Remotion en Windows.
# Ejecutar en PowerShell:  powershell -ExecutionPolicy Bypass -File scripts\instalar-windows.ps1
$ErrorActionPreference = "Stop"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
}
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  winget install -e --id Gyan.FFmpeg --accept-source-agreements --accept-package-agreements
}

# Recarga el PATH para ver node/ffmpeg recién instalados
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path", "User")

Set-Location (Join-Path $PSScriptRoot "..\video")
npm install
npx remotion browser ensure

node -v
ffmpeg -version | Select-Object -First 1
Write-Host "Listo. Abre el editor con:  cd video; npm run studio"
