import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BLANCO, NEGRO, fontFamily } from "../flexibilidad/estilo";
import { useEntradaSalida, useTrazo } from "../flexibilidad/piezas";
import { ROJO, VERDE } from "./Semaforo";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Tarjeta con título de color (el color de la luz activa).
export const Titulo: React.FC<{
  texto: string;
  color: string;
  colorTexto?: string;
  desde?: number;
  tamano?: number;
  etiqueta?: string;
}> = ({ texto, color, colorTexto = NEGRO, desde = 0, tamano = 58, etiqueta }) => {
  const { entrada, salida } = useEntradaSalida(desde);
  return (
    <div
      style={{
        fontFamily,
        transform: `scale(${entrada * salida})`,
        transformOrigin: "left center",
        opacity: Math.min(1, entrada) * salida,
      }}
    >
      {etiqueta ? (
        <div
          style={{
            display: "inline-block",
            background: NEGRO,
            color: BLANCO,
            fontWeight: 600,
            fontSize: 30,
            padding: "6px 18px",
            borderRadius: 10,
            marginBottom: 10,
            letterSpacing: 1,
          }}
        >
          {etiqueta}
        </div>
      ) : null}
      <div
        style={{
          background: color,
          color: colorTexto,
          fontWeight: 800,
          fontSize: tamano,
          lineHeight: 1.05,
          padding: "12px 26px",
          borderRadius: 18,
          textTransform: "uppercase",
          letterSpacing: -1,
          whiteSpace: "pre-line",
          boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// Elemento de lista con icono (check verde o cruz roja) que entra deslizando.
export const Item: React.FC<{
  texto: string;
  desde: number;
  tipo: "check" | "cruz" | "punto";
  color?: string;
  tamano?: number;
}> = ({ texto, desde, tipo, color = VERDE, tamano = 40 }) => {
  const { entrada, salida } = useEntradaSalida(desde);
  const off = useTrazo(desde + 4, 10);
  const icono =
    tipo === "check" ? (
      <path d="M6.5 12.5l3.5 3.5 7.5-8" />
    ) : tipo === "cruz" ? (
      <path d="M7.5 7.5l9 9M16.5 7.5l-9 9" />
    ) : (
      <circle cx="12" cy="12" r="3" />
    );
  const fondoIcono = tipo === "cruz" ? ROJO : color;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(255,255,255,0.95)",
        color: NEGRO,
        fontFamily,
        fontWeight: 600,
        fontSize: tamano,
        padding: "8px 22px 8px 10px",
        borderRadius: 999,
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        transform: `translateX(${(1 - entrada) * 60}px) scale(${salida})`,
        opacity: Math.min(1, entrada) * salida,
      }}
    >
      <svg width={tamano * 1.25} height={tamano * 1.25} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill={fondoIcono} />
        <g
          fill="none"
          stroke={BLANCO}
          strokeWidth={2.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={off}
        >
          {icono}
        </g>
      </svg>
      {texto}
    </div>
  );
};

// "−20 KG" que se tacha: la meta que no se cumplió.
export const MetaTachada: React.FC<{ desde: number }> = ({ desde }) => {
  const { entrada, salida, frame } = useEntradaSalida(desde);
  const tacha = interpolate(frame, [desde + 30, desde + 42], [0, 1], clamp);
  return (
    <div
      style={{
        position: "relative",
        fontFamily,
        fontWeight: 800,
        fontSize: 150,
        color: BLANCO,
        textShadow: "0 8px 0 #000, 0 12px 30px rgba(0,0,0,0.5)",
        transform: `scale(${entrada * salida}) rotate(-4deg)`,
        lineHeight: 1,
      }}
    >
      −20 KG
      <div
        style={{
          position: "absolute",
          left: -10,
          top: "48%",
          height: 18,
          width: `${tacha * 105}%`,
          background: ROJO,
          borderRadius: 9,
          transform: "rotate(-8deg)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
};

// Calendario de diciembre al que se le arrancan las hojas: "se acaba el año".
export const Calendario: React.FC<{ desde: number }> = ({ desde }) => {
  const { entrada, salida, frame } = useEntradaSalida(desde);
  const dias = Math.round(interpolate(frame, [desde, desde + 50], [25, 31], clamp));
  return (
    <div
      style={{
        width: 210,
        borderRadius: 22,
        overflow: "hidden",
        background: BLANCO,
        fontFamily,
        textAlign: "center",
        boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
        transform: `scale(${entrada * salida}) rotate(6deg)`,
      }}
    >
      <div style={{ background: ROJO, color: BLANCO, fontWeight: 800, fontSize: 40, padding: 8 }}>
        DIC
      </div>
      <div style={{ color: NEGRO, fontWeight: 800, fontSize: 110, lineHeight: 1.2 }}>{dias}</div>
    </div>
  );
};

// Diana con un dardo que llega: "el tipo de objetivo que te estás fijando".
export const Diana: React.FC<{ desde: number; tamano?: number }> = ({ desde, tamano = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { entrada, salida } = useEntradaSalida(desde);
  const dardo = spring({ frame: frame - desde - 12, fps, config: { damping: 9, stiffness: 200 } });
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 100 100"
      style={{ transform: `scale(${entrada * salida})`, overflow: "visible" }}
    >
      {[46, 34, 22, 10].map((r, i) => (
        <circle key={r} cx="50" cy="50" r={r} fill={i % 2 === 0 ? ROJO : BLANCO} />
      ))}
      <g transform={`translate(${(1 - dardo) * 80}, ${(1 - dardo) * -80})`}>
        <line x1="50" y1="50" x2="88" y2="12" stroke={NEGRO} strokeWidth={4} strokeLinecap="round" />
        <path d="M84 8 L96 4 L92 16 Z" fill={NEGRO} />
      </g>
    </svg>
  );
};

// Barra de control: de "más control" (verde) a "menos control" (rojo).
export const BarraControl: React.FC<{ desde: number; ancho?: number }> = ({
  desde,
  ancho = 620,
}) => {
  const frame = useCurrentFrame();
  const { salida } = useEntradaSalida(desde);
  const p = interpolate(frame, [desde, desde + 25], [0, 1], clamp);
  return (
    <div style={{ width: ancho, fontFamily, opacity: Math.min(1, p * 2) * salida }}>
      <div
        style={{
          height: 26,
          width: ancho * p,
          borderRadius: 13,
          background: `linear-gradient(90deg, ${VERDE}, #FFD60A, ${ROJO})`,
          boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
          fontWeight: 800,
          fontSize: 30,
          color: BLANCO,
          textShadow: "0 3px 10px rgba(0,0,0,0.8)",
        }}
      >
        <span>+ CONTROL</span>
        <span>− CONTROL</span>
      </div>
    </div>
  );
};

// Gráfica de barras "este mes" vs "otro mes": la segunda crece y la supera.
export const BarrasPeso: React.FC<{ desde: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { salida } = useEntradaSalida(desde);
  const b1 = spring({ frame: frame - desde, fps, config: { damping: 200 } });
  const b2 = spring({ frame: frame - desde - 40, fps, config: { damping: 11 } });
  const barra = (alto: number, color: string, etiqueta: string, valor: number) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 120,
          height: alto * valor,
          background: color,
          borderRadius: "14px 14px 4px 4px",
          boxShadow: "0 8px 18px rgba(0,0,0,0.3)",
        }}
      />
      <div
        style={{
          fontWeight: 800,
          fontSize: 28,
          color: BLANCO,
          textShadow: "0 3px 10px rgba(0,0,0,0.8)",
        }}
      >
        {etiqueta}
      </div>
    </div>
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 40,
        height: 260,
        fontFamily,
        opacity: salida,
      }}
    >
      {barra(150, "rgba(255,255,255,0.85)", "ESTE MES", b1)}
      {barra(230, "#FFD60A", "OTRO MES", b2)}
      <svg
        width={90}
        height={90}
        viewBox="0 0 24 24"
        style={{ marginBottom: 150, opacity: b2, transform: `translateY(${(1 - b2) * 30}px)` }}
      >
        <path d="M12 3l7 8h-4v9H9v-9H5z" fill="#FFD60A" stroke={NEGRO} strokeWidth={1} />
      </svg>
    </div>
  );
};

// Libreta / diario de entrenamiento con líneas que se escriben solas.
export const Diario: React.FC<{ desde: number }> = ({ desde }) => {
  const { entrada, salida, frame } = useEntradaSalida(desde);
  return (
    <svg
      width={170}
      height={210}
      viewBox="0 0 34 42"
      style={{ transform: `scale(${entrada * salida}) rotate(-6deg)` }}
    >
      <rect x="2" y="1" width="30" height="40" rx="3" fill={BLANCO} stroke={NEGRO} strokeWidth="1.2" />
      {[6, 12, 18, 24, 30, 36].map((y) => (
        <circle key={y} cx="2" cy={y} r="1.6" fill={NEGRO} />
      ))}
      {[9, 15, 21, 27, 33].map((y, i) => {
        const p = interpolate(frame, [desde + 8 + i * 6, desde + 16 + i * 6], [0, 1], clamp);
        return (
          <line
            key={y}
            x1="7"
            y1={y}
            x2={7 + 20 * p}
            y2={y}
            stroke={i === 4 ? "#FFD60A" : "#9CA3AF"}
            strokeWidth={i === 4 ? 2.4 : 1.4}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

const Silueta: React.FC<{ color: string; ancho: number }> = ({ color, ancho }) => (
  <svg width={ancho} height={ancho * 1.5} viewBox="0 0 20 30">
    <circle cx="10" cy="5" r="4.5" fill={color} />
    <path d="M3 30v-12c0-4 3-7 7-7s7 3 7 7v12z" fill={color} />
  </svg>
);

// Tú vs. otra persona, con un "≠" que se tacha en rojo: no te compares.
export const Comparacion: React.FC<{ desde: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { salida } = useEntradaSalida(desde);
  const a = spring({ frame: frame - desde, fps, config: { damping: 12 } });
  const b = spring({ frame: frame - desde - 6, fps, config: { damping: 12 } });
  const vs = spring({ frame: frame - desde - 14, fps, config: { damping: 8 } });
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 26, opacity: salida, fontFamily }}>
      <div style={{ transform: `scale(${a})` }}>
        <Silueta color="#FFD60A" ancho={80} />
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 70,
          color: BLANCO,
          background: ROJO,
          borderRadius: 18,
          padding: "0 18px",
          marginBottom: 40,
          transform: `scale(${vs}) rotate(-8deg)`,
          boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
        }}
      >
        VS
      </div>
      <div style={{ transform: `scale(${b})` }}>
        <Silueta color={BLANCO} ancho={80} />
      </div>
    </div>
  );
};

// Señal de advertencia triangular que "parpadea" al aparecer.
export const Advertencia: React.FC<{ desde: number }> = ({ desde }) => {
  const { entrada, salida, frame } = useEntradaSalida(desde);
  const parpadeo = frame - desde < 24 ? (Math.floor((frame - desde) / 4) % 2 === 0 ? 1 : 0.4) : 1;
  return (
    <svg
      width={120}
      height={110}
      viewBox="0 0 24 22"
      style={{ transform: `scale(${entrada * salida})`, opacity: parpadeo }}
    >
      <path d="M12 1L23 21H1z" fill="#FFD60A" stroke={NEGRO} strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="11" y="7" width="2" height="8" rx="1" fill={NEGRO} />
      <circle cx="12" cy="18" r="1.3" fill={NEGRO} />
    </svg>
  );
};
