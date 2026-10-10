import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AMARILLO, BLANCO, NEGRO, fontFamily } from "./estilo";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Entrada con muelle desde `desde` (frames relativos a la Sequence) y salida al final.
export const useEntradaSalida = (desde = 0, salidaFrames = 8) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entrada = spring({ frame: frame - desde, fps, config: { damping: 14, stiffness: 160 } });
  const salida = interpolate(
    frame,
    [durationInFrames - salidaFrames, durationInFrames],
    [1, 0],
    clamp,
  );
  return { entrada, salida, frame };
};

// Zona superior del vídeo (la pared), donde no hay cara ni subtítulos.
export const ZonaSuperior: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      top: 110,
      height: 470,
      justifyContent: "center",
      alignItems: "center",
      fontFamily,
    }}
  >
    {children}
  </AbsoluteFill>
);

// Título en bloque: texto negro sobre franja amarilla o blanca, con barrido.
export const Rotulo: React.FC<{
  texto: string;
  desde?: number;
  fondo?: string;
  color?: string;
  tamano?: number;
  inclinado?: boolean;
}> = ({ texto, desde = 0, fondo = BLANCO, color = NEGRO, tamano = 76, inclinado = true }) => {
  const { entrada, salida } = useEntradaSalida(desde);
  return (
    <div
      style={{
        backgroundColor: fondo,
        color,
        fontSize: tamano,
        fontWeight: 800,
        lineHeight: 1.05,
        padding: "14px 34px",
        borderRadius: 18,
        textTransform: "uppercase",
        textAlign: "center",
        letterSpacing: -1,
        boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        transform: `rotate(${inclinado ? -2 : 0}deg) scale(${entrada * salida})`,
        opacity: Math.min(entrada, salida),
        clipPath: `inset(0 ${(1 - Math.min(1, entrada)) * 100}% 0 0 round 18px)`,
        maxWidth: 940,
      }}
    >
      {texto}
    </div>
  );
};

// Etiqueta pequeña que aparece con un "pop".
export const Chip: React.FC<{
  texto: string;
  desde: number;
  icono?: React.ReactNode;
  fondo?: string;
  color?: string;
}> = ({ texto, desde, icono, fondo = NEGRO, color = BLANCO }) => {
  const { entrada, salida } = useEntradaSalida(desde);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        fontFamily,
        backgroundColor: fondo,
        color,
        fontSize: 46,
        fontWeight: 600,
        padding: "12px 30px",
        borderRadius: 999,
        transform: `scale(${entrada * salida}) translateY(${(1 - entrada) * 30}px)`,
        opacity: Math.min(1, entrada) * salida,
        boxShadow: "0 8px 22px rgba(0,0,0,0.25)",
      }}
    >
      {icono}
      {texto}
    </div>
  );
};

// Trazo SVG que se dibuja progresivamente.
export const useTrazo = (desde: number, duracion: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [desde, desde + duracion], [1, 0], clamp);
};

export const Check: React.FC<{ desde: number; tamano?: number }> = ({ desde, tamano = 56 }) => {
  const off = useTrazo(desde, 10);
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill={AMARILLO} />
      <path
        d="M6.5 12.5l3.5 3.5 7.5-8"
        fill="none"
        stroke={NEGRO}
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={off}
      />
    </svg>
  );
};

// Flecha que crece de izquierda a derecha (línea de tiempo: "cuanto antes").
export const FlechaTiempo: React.FC<{ desde: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - desde, fps, config: { damping: 200 }, durationInFrames: 30 });
  const { salida } = useEntradaSalida();
  const ancho = 760;
  return (
    <div style={{ position: "relative", width: ancho, height: 90, opacity: salida }}>
      <div
        style={{
          position: "absolute",
          top: 39,
          left: 0,
          height: 12,
          width: ancho * p,
          borderRadius: 6,
          background: `linear-gradient(90deg, ${AMARILLO}, ${BLANCO})`,
          boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
        }}
      />
      <svg
        width={60}
        height={60}
        viewBox="0 0 24 24"
        style={{ position: "absolute", top: 15, left: ancho * p - 34, opacity: p }}
      >
        <path d="M5 4l14 8-14 8z" fill={BLANCO} />
      </svg>
      {["HOY", "+ MOVILIDAD", "+ SALUD"].map((t, i) => {
        const aparece = interpolate(p, [i * 0.33, i * 0.33 + 0.15], [0, 1], clamp);
        return (
          <div
            key={t}
            style={{
              position: "absolute",
              top: -8,
              left: i * (ancho / 3) - 4,
              fontFamily,
              fontWeight: 800,
              fontSize: 40,
              color: i === 0 ? AMARILLO : BLANCO,
              opacity: aparece,
              textShadow: "0 3px 10px rgba(0,0,0,0.6)",
              transform: `translateY(${(1 - aparece) * 12}px)`,
            }}
          >
            {t}
          </div>
        );
      })}
    </div>
  );
};

// Escudo que se dibuja: "ganarle la batalla a futuras lesiones".
export const Escudo: React.FC<{ desde: number }> = ({ desde }) => {
  const off = useTrazo(desde, 18);
  const { entrada, salida } = useEntradaSalida(desde);
  const frame = useCurrentFrame();
  const brillo = interpolate(Math.sin(frame / 6), [-1, 1], [0.35, 0.8]);
  return (
    <svg
      width={190}
      height={190}
      viewBox="0 0 24 24"
      style={{
        transform: `scale(${entrada * salida})`,
        filter: `drop-shadow(0 0 ${18 * brillo}px ${AMARILLO})`,
      }}
    >
      <path
        d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z"
        fill={`rgba(255,232,26,${0.9 * (1 - off)})`}
        stroke={BLANCO}
        strokeWidth={1.2}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={off}
      />
      <path
        d="M8.2 12.2l2.6 2.6 5-5.2"
        fill="none"
        stroke={NEGRO}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={useTrazo(desde + 14, 10)}
      />
    </svg>
  );
};

// Signo de interrogación grande que "late".
export const Interrogacion: React.FC<{ desde: number }> = ({ desde }) => {
  const { entrada, salida, frame } = useEntradaSalida(desde);
  const pulso = 1 + 0.05 * Math.sin((frame - desde) / 5);
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 800,
        fontSize: 170,
        lineHeight: 1,
        color: AMARILLO,
        textShadow: "0 8px 0 #000, 0 10px 30px rgba(0,0,0,0.4)",
        transform: `scale(${entrada * salida * pulso}) rotate(${(1 - entrada) * -30 + 8}deg)`,
      }}
    >
      ?
    </div>
  );
};

const Persona: React.FC<{ color: string; tamano: number }> = ({ color, tamano }) => (
  <svg width={tamano} height={tamano * 1.25} viewBox="0 0 20 25">
    <circle cx="10" cy="6" r="5" fill={color} />
    <path d="M1 25c0-6 4-10 9-10s9 4 9 10z" fill={color} />
  </svg>
);

// Grupo de personas mirando a una sola, que tiembla: el miedo al "qué dirán".
export const GrupoMirando: React.FC<{ desde: number }> = ({ desde }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { salida } = useEntradaSalida();
  const temblor = frame > desde + 35 ? Math.sin(frame * 1.7) * 3 : 0;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 18, opacity: salida }}>
      {[0, 1, 2].map((i) => {
        const e = spring({ frame: frame - desde - i * 4, fps, config: { damping: 12 } });
        return (
          <div key={i} style={{ transform: `scale(${e})`, opacity: 0.9 }}>
            <Persona color={BLANCO} tamano={70} />
          </div>
        );
      })}
      <div
        style={{
          marginLeft: 50,
          transform: `scale(${spring({ frame: frame - desde - 14, fps, config: { damping: 12 } })}) translateX(${temblor}px)`,
        }}
      >
        <Persona color={AMARILLO} tamano={92} />
      </div>
    </div>
  );
};

// Barra de progreso superior para retener la atención.
export const BarraProgreso: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 12,
        width: (width * frame) / Math.max(1, durationInFrames - 1),
        backgroundColor: AMARILLO,
        boxShadow: "0 0 12px rgba(255,232,26,0.8)",
      }}
    />
  );
};
