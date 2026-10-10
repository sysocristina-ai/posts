import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuente incluida en public/fonts para que el render no dependa de internet.
export const fontFamily = "Poppins";
for (const weight of ["600", "800"]) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/Poppins-${weight}.ttf`),
    weight,
    format: "truetype",
  });
}

// Misma estética que los subtítulos del vídeo: blanco, negro y amarillo.
export const AMARILLO = "#FFE81A";
export const NEGRO = "#111111";
export const BLANCO = "#FFFFFF";

export const FPS = 30;
export const s = (segundos: number) => Math.round(segundos * FPS);
