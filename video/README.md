# Vídeos con Remotion

Proyecto de [Remotion](https://www.remotion.dev) para crear y editar vídeos con código (React).

## Instalación en tu ordenador

Desde la raíz del repositorio, ejecuta el script de tu sistema. Instala Node.js, FFmpeg,
las dependencias del proyecto y el navegador headless que usa Remotion para renderizar:

| Sistema | Comando |
|---|---|
| macOS | `bash scripts/instalar-mac.sh` |
| Windows | `powershell -ExecutionPolicy Bypass -File scripts\instalar-windows.ps1` |
| Ubuntu/Debian | `bash scripts/instalar-linux.sh` |

## Uso

```bash
cd video
npm run studio   # editor visual en el navegador (http://localhost:3000)
npm run render   # renderiza MiVideo en out/video.mp4
npm run check    # lista las composiciones disponibles
```

Cambiar textos sin tocar el código:

```bash
npx remotion render MiVideo out/otro.mp4 --props='{"titulo":"Nuevo título","subtitulo":"...","colorFondo":"#222","colorTexto":"#fff"}'
```

## Estructura

- `src/Root.tsx` — registra las composiciones (tamaño, fps, duración, props por defecto).
- `src/MiVideo.tsx` — composición de ejemplo (1080×1920, 5 s). Cópiala para crear vídeos nuevos.
- `public/` — pon aquí imágenes, vídeos y audios; úsalos con `staticFile("archivo.mp4")`.
- `out/` — vídeos renderizados (ignorada por git).
