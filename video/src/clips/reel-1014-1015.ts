import { Corte } from "./UnionClips";

// Tramos con voz de cada clip (segundos), detectados automáticamente quitando silencios.
// Para ajustar un corte, cambia "desde"/"hasta"; para quitar una toma, borra su línea.
// Orden: primero 1015, después 1014.
export const cortes1014y1015: Corte[] = [
  { video: "1015.mp4", desde: 0.79, hasta: 4.26 },
  { video: "1015.mp4", desde: 4.93, hasta: 12.6 },
  { video: "1015.mp4", desde: 12.9, hasta: 16.98 },
  { video: "1015.mp4", desde: 17.69, hasta: 21.76 },
  { video: "1015.mp4", desde: 22.1, hasta: 31.0 },
  { video: "1015.mp4", desde: 31.94, hasta: 36.56 },
  { video: "1015.mp4", desde: 36.86, hasta: 38.97 },
  { video: "1015.mp4", desde: 39.37, hasta: 45.24 },
  { video: "1015.mp4", desde: 45.58, hasta: 46.87 },
  { video: "1015.mp4", desde: 47.84, hasta: 54.48 },
  { video: "1015.mp4", desde: 54.92, hasta: 60.32 },
  { video: "1015.mp4", desde: 61.51, hasta: 66.13 },
  { video: "1015.mp4", desde: 66.45, hasta: 70.05 },
  { video: "1015.mp4", desde: 70.44, hasta: 74.65 },
  { video: "1015.mp4", desde: 75.24, hasta: 78.71 },
  { video: "1015.mp4", desde: 79.61, hasta: 83.62 },
  { video: "1015.mp4", desde: 84.03, hasta: 85.82 },
  { video: "1015.mp4", desde: 86.17, hasta: 93.81 },
  { video: "1014.mp4", desde: 4.47, hasta: 10.37 },
  { video: "1014.mp4", desde: 11.05, hasta: 17.23 },
];
