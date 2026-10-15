import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const VERDE = "#22C55E";
export const AMBAR = "#FFD60A";
export const ROJO = "#EF4444";

export type Luz = "verde" | "ambar" | "rojo";

const COLORES: Record<Luz, string> = { verde: VERDE, ambar: AMBAR, rojo: ROJO };

// Semáforo vertical. `encendidas` dice qué luces están activas en este frame;
// cada luz se enciende con un pequeño "flash" y un halo que respira.
export const Semaforo: React.FC<{
  encendidas: Luz[];
  entrada: number;
  alto?: number;
}> = ({ encendidas, entrada, alto = 380 }) => {
  const frame = useCurrentFrame();
  const diametro = alto * 0.27;
  const respira = interpolate(Math.sin(frame / 7), [-1, 1], [0.7, 1]);
  const orden: Luz[] = ["rojo", "ambar", "verde"];

  return (
    <div
      style={{
        width: diametro + 44,
        height: alto,
        borderRadius: 34,
        background: "linear-gradient(180deg, #2b2b2b, #151515)",
        border: "4px solid #3a3a3a",
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        transform: `translateX(${(1 - entrada) * -320}px) rotate(${(1 - entrada) * -12}deg)`,
      }}
    >
      {orden.map((luz) => {
        const on = encendidas.includes(luz);
        const color = COLORES[luz];
        return (
          <div key={luz} style={{ position: "relative" }}>
            {/* visera */}
            <div
              style={{
                position: "absolute",
                top: -10,
                left: -8,
                width: diametro + 16,
                height: diametro / 2,
                borderRadius: `${diametro}px ${diametro}px 0 0`,
                background: "#0d0d0d",
                opacity: 0.8,
              }}
            />
            <div
              style={{
                position: "relative",
                width: diametro,
                height: diametro,
                borderRadius: "50%",
                background: on
                  ? `radial-gradient(circle at 35% 30%, #fff 0%, ${color} 35%, ${color} 100%)`
                  : color,
                opacity: on ? 1 : 0.18,
                boxShadow: on ? `0 0 ${40 * respira}px ${14 * respira}px ${color}` : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export const useEntradaSemaforo = (desde: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - desde, fps, config: { damping: 13, stiffness: 120 } });
};
