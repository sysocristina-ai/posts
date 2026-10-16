import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { fontFamily } from "../flexibilidad/estilo";

// Un color por nivel de motivación: de gris (amotivación) a verde (integrada).
export const COLORES_NIVEL = ["#9CA3AF", "#EF4444", "#F97316", "#FFD60A", "#22C55E"];

// Batería vertical de 5 segmentos que se "carga" hasta el nivel actual.
// En el nivel 1 parpadea como batería baja; en el 5 brilla.
export const Bateria: React.FC<{
  nivel: number;
  entrada: number;
  alto?: number;
}> = ({ nivel, entrada, alto = 330 }) => {
  const frame = useCurrentFrame();
  const ancho = alto * 0.48;
  const respira = interpolate(Math.sin(frame / 6), [-1, 1], [0.55, 1]);
  const parpadeo = nivel === 1 ? (Math.floor(frame / 8) % 2 === 0 ? 1 : 0.25) : 1;
  const colorActivo = COLORES_NIVEL[Math.max(0, Math.ceil(nivel) - 1)];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `translateX(${(1 - entrada) * -300}px) rotate(${(1 - entrada) * -15}deg)`,
        fontFamily,
      }}
    >
      {/* polo de la batería */}
      <div
        style={{
          width: ancho * 0.4,
          height: alto * 0.05,
          background: "#2b2b2b",
          borderRadius: "10px 10px 0 0",
        }}
      />
      <div
        style={{
          width: ancho,
          height: alto,
          borderRadius: 26,
          border: "6px solid #2b2b2b",
          background: "rgba(20,20,20,0.85)",
          padding: 10,
          display: "flex",
          flexDirection: "column-reverse",
          gap: 8,
          boxShadow:
            nivel >= 5
              ? `0 0 ${50 * respira}px ${12 * respira}px ${colorActivo}`
              : "0 16px 36px rgba(0,0,0,0.45)",
        }}
      >
        {COLORES_NIVEL.map((c, i) => {
          // relleno parcial para animar la carga entre niveles
          const lleno = Math.max(0, Math.min(1, nivel - i));
          return (
            <div
              key={i}
              style={{
                flex: 1,
                borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: "100%",
                  width: `${lleno * 100}%`,
                  background: colorActivo,
                  opacity: i === 0 ? parpadeo : 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: alto * 0.08,
                  color: lleno > 0.5 ? "#111" : "rgba(255,255,255,0.45)",
                }}
              >
                {i + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
