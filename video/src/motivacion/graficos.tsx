import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BLANCO, NEGRO, fontFamily } from "../flexibilidad/estilo";
import { useEntradaSalida } from "../flexibilidad/piezas";
import { COLORES_NIVEL } from "./Bateria";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Gancho: "¿entrenas porque QUIERES o porque te TOCA?" con un selector que duda.
export const QuieroOMeToca: React.FC<{ desdeToca: number }> = ({ desdeToca }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { salida } = useEntradaSalida();
  const a = spring({ frame, fps, config: { damping: 12 } });
  const b = spring({ frame: frame - desdeToca, fps, config: { damping: 12 } });
  // el selector va y viene entre las dos opciones
  const pos = frame < desdeToca ? 0 : interpolate(Math.sin((frame - desdeToca) / 7), [-1, 1], [0, 1]);
  const ancho = 900;
  const opcion = (texto: string, color: string, e: number) => (
    <div
      style={{
        width: ancho / 2 - 10,
        textAlign: "center",
        background: color,
        color: BLANCO,
        fontWeight: 800,
        fontSize: 46,
        padding: "18px 0",
        borderRadius: 999,
        transform: `scale(${e})`,
        boxShadow: "0 10px 26px rgba(0,0,0,0.3)",
      }}
    >
      {texto}
    </div>
  );
  return (
    <div style={{ fontFamily, opacity: salida, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div
        style={{
          fontWeight: 800,
          fontSize: 64,
          color: BLANCO,
          textShadow: "0 5px 0 #000, 0 8px 24px rgba(0,0,0,0.5)",
          transform: `scale(${a})`,
        }}
      >
        ¿ENTRENAS PORQUE…
      </div>
      <div style={{ position: "relative", display: "flex", gap: 20 }}>
        {opcion("QUIERES", "#22C55E", a)}
        {opcion("TE TOCA", "#EF4444", b)}
        <div
          style={{
            position: "absolute",
            top: -26,
            left: pos * (ancho / 2 + 10) + ancho / 4 - 22,
            width: 0,
            height: 0,
            borderLeft: "22px solid transparent",
            borderRight: "22px solid transparent",
            borderTop: `26px solid ${BLANCO}`,
            filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.5))",
            opacity: a,
          }}
        />
      </div>
    </div>
  );
};

// "No todo es blanco o negro": una tarjeta mitad negra, mitad blanca que se vuelve degradado.
export const BlancoONegro: React.FC<{ desdeMatices: number }> = ({ desdeMatices }) => {
  const frame = useCurrentFrame();
  const { entrada, salida } = useEntradaSalida();
  const m = interpolate(frame, [desdeMatices, desdeMatices + 20], [0, 1], clamp);
  const fondo =
    m < 0.01
      ? "linear-gradient(90deg, #111 50%, #fff 50%)"
      : `linear-gradient(90deg, #111 ${50 - 50 * m}%, ${COLORES_NIVEL.map((c, i) => `${c} ${10 + i * 20}%`).join(", ")}, #fff ${50 + 50 * m}%)`;
  return (
    <div
      style={{
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transform: `scale(${entrada * salida})`,
      }}
    >
      <div
        style={{
          width: 820,
          height: 90,
          borderRadius: 24,
          background: fondo,
          border: "5px solid #fff",
          boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        }}
      />
      <div
        style={{
          fontWeight: 800,
          fontSize: 56,
          color: m < 0.5 ? NEGRO : BLANCO,
          background: m < 0.5 ? BLANCO : NEGRO,
          padding: "8px 28px",
          borderRadius: 16,
          textTransform: "uppercase",
          boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
        }}
      >
        {m < 0.5 ? "¿Todo es blanco o negro?" : "No: hay matices"}
      </div>
    </div>
  );
};

// Chispa (estrella de 4 puntas). Apagada y tachada, o encendida y brillando.
export const Chispa: React.FC<{ desde: number; encendida: boolean; tamano?: number }> = ({
  desde,
  encendida,
  tamano = 120,
}) => {
  const { entrada, salida, frame } = useEntradaSalida(desde);
  const brillo = encendida ? interpolate(Math.sin(frame / 5), [-1, 1], [0.6, 1]) : 0;
  const giro = encendida ? frame * 2 : 0;
  return (
    <div style={{ position: "relative", width: tamano, height: tamano, transform: `scale(${entrada * salida})` }}>
      <svg
        width={tamano}
        height={tamano}
        viewBox="0 0 24 24"
        style={{
          transform: `rotate(${giro}deg)`,
          filter: encendida ? `drop-shadow(0 0 ${16 * brillo}px #FFD60A)` : "none",
        }}
      >
        <path
          d="M12 1 C13 8 16 11 23 12 C16 13 13 16 12 23 C11 16 8 13 1 12 C8 11 11 8 12 1Z"
          fill={encendida ? "#FFD60A" : "#6B7280"}
          stroke={NEGRO}
          strokeWidth={0.8}
        />
      </svg>
      {!encendida ? (
        <div
          style={{
            position: "absolute",
            left: -6,
            top: "46%",
            width: tamano + 12,
            height: 10,
            background: "#EF4444",
            borderRadius: 5,
            transform: `rotate(-35deg) scaleX(${interpolate(frame, [desde + 10, desde + 20], [0, 1], clamp)})`,
          }}
        />
      ) : null}
    </div>
  );
};

// Encuesta final: "del 1 al 5, ¿en qué nivel estás?" con burbujas de colores.
export const Encuesta: React.FC<{ desde: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { salida } = useEntradaSalida();
  const resaltado = Math.floor((frame - desde) / 12) % 5;
  return (
    <div style={{ display: "flex", gap: 18, fontFamily, opacity: salida }}>
      {COLORES_NIVEL.map((c, i) => {
        const e = spring({ frame: frame - desde - i * 5, fps, config: { damping: 10 } });
        const activo = frame > desde + 40 && i === resaltado;
        return (
          <div
            key={i}
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: c,
              color: NEGRO,
              fontWeight: 800,
              fontSize: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "5px solid #fff",
              transform: `scale(${e * (activo ? 1.15 : 1)}) translateY(${activo ? -10 : 0}px)`,
              boxShadow: activo ? `0 0 30px 6px ${c}` : "0 10px 24px rgba(0,0,0,0.3)",
            }}
          >
            {i + 1}
          </div>
        );
      })}
    </div>
  );
};

// Bocadillo de comentario que "salta": invita a comentar.
export const Comenta: React.FC<{ texto: string; desde?: number }> = ({ texto, desde = 0 }) => {
  const { entrada, salida, frame } = useEntradaSalida(desde);
  const salto = Math.abs(Math.sin((frame - desde) / 6)) * 8;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: BLANCO,
        color: NEGRO,
        fontFamily,
        fontWeight: 800,
        fontSize: 44,
        padding: "12px 30px 12px 18px",
        borderRadius: 999,
        boxShadow: "0 10px 26px rgba(0,0,0,0.3)",
        transform: `scale(${entrada * salida}) translateY(${-salto}px)`,
      }}
    >
      <svg width={54} height={54} viewBox="0 0 24 24">
        <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#22C55E" />
        <circle cx="8" cy="10.5" r="1.4" fill="#fff" />
        <circle cx="12" cy="10.5" r="1.4" fill="#fff" />
        <circle cx="16" cy="10.5" r="1.4" fill="#fff" />
      </svg>
      {texto}
    </div>
  );
};
