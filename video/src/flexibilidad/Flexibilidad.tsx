import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { AMARILLO, BLANCO, NEGRO, FPS, s } from "./estilo";
import {
  BarraProgreso,
  Check,
  Chip,
  Escudo,
  FlechaTiempo,
  GrupoMirando,
  Interrogacion,
  Rotulo,
  ZonaSuperior,
} from "./piezas";

export type FlexibilidadProps = {
  // Archivo dentro de public/. Sustitúyelo por el original para el render final.
  video: string;
  llamadaFinal: string;
};

export const calcularMetadatos: CalculateMetadataFunction<FlexibilidadProps> = async ({
  props,
}) => {
  const { slowDurationInSeconds } = await parseMedia({
    src: staticFile(props.video),
    fields: { slowDurationInSeconds: true },
    acknowledgeRemotionLicense: true,
  });
  return { durationInFrames: Math.floor(slowDurationInSeconds * FPS), fps: FPS };
};

// Tramos del guion (segundos), sacados de los subtítulos del vídeo.
const T = {
  gancho: [0.2, 2.8],
  pronto: [2.8, 5.3],
  lesiones: [5.4, 9.1],
  pregunta: [9.4, 15.6],
  miedo: [15.8, 20.2],
  mayoria: [21.0, 99],
} as const;

const Tramo: React.FC<{ t: readonly [number, number]; children: React.ReactNode }> = ({
  t,
  children,
}) => (
  <Sequence from={s(t[0])} durationInFrames={s(t[1] - t[0])} layout="none">
    {children}
  </Sequence>
);

// Zoom de "golpe" en los cambios de idea, con un leve acercamiento continuo.
const useZoom = () => {
  const frame = useCurrentFrame();
  const golpe = (inicio: number, objetivo: number, base: number) =>
    interpolate(frame, [s(inicio), s(inicio) + 6], [base, objetivo], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  if (frame >= s(T.mayoria[0])) return golpe(T.mayoria[0], 1.09, 1.0);
  if (frame >= s(T.miedo[0])) return golpe(T.miedo[0], 1.0, 1.08);
  if (frame >= s(T.pregunta[0])) return golpe(T.pregunta[0], 1.08, 1.03);
  return interpolate(frame, [0, s(T.pregunta[0])], [1.0, 1.03]);
};

const Destello: React.FC<{ en: number }> = ({ en }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [s(en), s(en) + 2, s(en) + 7], [0, 0.35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ backgroundColor: BLANCO, opacity: o }} />;
};

export const Flexibilidad: React.FC<FlexibilidadProps> = ({ video, llamadaFinal }) => {
  const zoom = useZoom();

  return (
    <AbsoluteFill style={{ backgroundColor: NEGRO }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo
          src={staticFile(video)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Oscurece un poco la pared para que los gráficos se lean bien */}
      <AbsoluteFill
        style={{
          height: 700,
          background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      <Tramo t={T.gancho}>
        <ZonaSuperior>
          <Rotulo texto="La flexibilidad se entrena" fondo={AMARILLO} tamano={74} />
          <div style={{ height: 34 }} />
          <Chip texto="Nunca es tarde" desde={s(2.0)} icono={<Check desde={s(2.1)} />} />
        </ZonaSuperior>
      </Tramo>

      <Tramo t={T.pronto}>
        <ZonaSuperior>
          <Rotulo texto="Entre más pronto, mejor" tamano={68} />
          <div style={{ height: 60 }} />
          <FlechaTiempo desde={s(1.0)} />
        </ZonaSuperior>
      </Tramo>

      <Tramo t={T.lesiones}>
        <ZonaSuperior>
          <Escudo desde={0} />
          <div style={{ height: 24 }} />
          <Rotulo texto="Gánale a las lesiones" fondo={AMARILLO} tamano={66} desde={s(1.6)} />
        </ZonaSuperior>
      </Tramo>

      <Tramo t={T.pregunta}>
        <ZonaSuperior>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Rotulo texto="¿Te has privado?" tamano={72} desde={s(0.4)} />
            <Interrogacion desde={0} />
          </div>
          <div style={{ display: "flex", gap: 22, marginTop: 10 }}>
            <Chip texto="Yoga" desde={s(2.6)} fondo={AMARILLO} color={NEGRO} />
            <Chip texto="Otras disciplinas" desde={s(3.6)} />
          </div>
        </ZonaSuperior>
      </Tramo>

      <Tramo t={T.miedo}>
        <ZonaSuperior>
          <Rotulo texto="Miedo al qué dirán" fondo={AMARILLO} tamano={74} desde={s(1.0)} />
          <div style={{ height: 50 }} />
          <GrupoMirando desde={s(1.8)} />
        </ZonaSuperior>
      </Tramo>

      <Tramo t={T.mayoria}>
        <Sequence durationInFrames={s(1.7)} layout="none">
          <ZonaSuperior>
            <Rotulo texto="Pero…" tamano={80} inclinado={false} />
          </ZonaSuperior>
        </Sequence>
        <Sequence from={s(1.7)} layout="none">
          <ZonaSuperior>
            <Rotulo texto="No te pasa solo a ti" fondo={AMARILLO} tamano={74} />
            <div style={{ height: 30 }} />
            <Chip texto="A la mayoría nos pasa" desde={s(1.2)} />
          </ZonaSuperior>
        </Sequence>
        <Sequence from={s(3.4)} layout="none">
          <AbsoluteFill
            style={{ top: 1700, height: 160, justifyContent: "center", alignItems: "center" }}
          >
            <Chip texto={llamadaFinal} desde={0} fondo={AMARILLO} color={NEGRO} />
          </AbsoluteFill>
        </Sequence>
      </Tramo>

      <Destello en={T.pregunta[0]} />
      <Destello en={T.mayoria[0]} />
      <BarraProgreso />
    </AbsoluteFill>
  );
};
