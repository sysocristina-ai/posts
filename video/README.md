# Vídeos con Remotion

Proyecto de [Remotion](https://www.remotion.dev) para crear y editar vídeos con código (React).

## Instalación en tu ordenador

Requisitos: Node.js 18 o superior (el script lo instala o actualiza si hace falta).

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

Cambiar textos sin tocar el código: crea un archivo `props.json` en `video/`

```json
{ "titulo": "Nuevo título", "subtitulo": "Mi subtítulo", "colorFondo": "#222222", "colorTexto": "#ffffff" }
```

y renderiza con (funciona igual en macOS, Linux y Windows):

```bash
npx remotion render MiVideo out/otro.mp4 --props=props.json
```

## Vídeo «Flexibilidad» (`src/flexibilidad/`)

Edición de `public/1009.mp4` con rótulos, iconos animados, zooms y barra de progreso,
sincronizados con lo que se dice en el vídeo. Vista previa: `vista-previa/flexibilidad-preview.mp4`.

Render final con el vídeo original a máxima calidad:

1. Copia tu vídeo original a `video/public/` con el nombre `1009.mp4` (sustituye al que hay).
2. Ejecuta `npm run render:flexibilidad` dentro de `video/`.
3. El resultado queda en `video/out/flexibilidad.mp4`.

Los textos están en `src/flexibilidad/Flexibilidad.tsx`; los tiempos de cada tramo, en la constante `T`.

## Estructura

- `src/Root.tsx` — registra las composiciones (tamaño, fps, duración, props por defecto).
- `src/MiVideo.tsx` — composición de ejemplo (1080×1920, 5 s). Cópiala para crear vídeos nuevos.
- `public/` — pon aquí imágenes, vídeos y audios; úsalos con `staticFile("archivo.mp4")`.
- `out/` — vídeos renderizados (ignorada por git).
