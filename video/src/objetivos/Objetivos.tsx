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
  useVideoConfig,
} from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { BLANCO, FPS, s } from "../flexibilidad/estilo";
import { AMBAR, Luz, ROJO, Semaforo, VERDE, useEntradaSemaforo } from "./Semaforo";
import {
  Advertencia,
  BarraControl,
  BarrasPeso,
  Calendario,
  Comparacion,
  Diana,
  Diario,
  Item,
  MetaTachada,
  Titulo,
} from "./graficos";

export type ObjetivosProps = { video: string; llamadaFinal: string };

export const calcularMetadatosObjetivos: CalculateMetadataFunction<ObjetivosProps> = async ({
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
  intro: 0.2,
  meta: 5.8,
  tipo: 9.0,
  clasificacion: 13.5,
  semaforo: 15.0,
  proceso: 23.4,
  rendimiento: 41.5,
  resultado: 61.0,
  clave: 83.3,
} as const;

const Tramo: React.FC<{ desde: number; hasta?: number; children: React.ReactNode }> = ({
  desde,
  hasta,
  children,
}) => (
  <Sequence
    from={s(desde)}
    durationInFrames={hasta === undefined ? undefined : s(hasta - desde)}
    layout="none"
  >
    {children}
  </Sequence>
);

// Qué luces están encendidas en cada momento.
const lucesEn = (t: number): Luz[] => {
  if (t >= T.clave + 0.7) {
    const l: Luz[] = ["verde"];
    if (t >= T.clave + 1.0) l.push("ambar");
    if (t >= T.clave + 1.3) l.push("rojo");
    return l;
  }
  if (t >= T.resultado) return ["rojo"];
  if (t >= T.rendimiento) return ["ambar"];
  if (t >= T.proceso) return ["verde"];
  const l: Luz[] = [];
  if (t >= 16.2) l.push("verde");
  if (t >= 16.6) l.push("ambar");
  if (t >= 17.0) l.push("rojo");
  return l;
};

const colorEn = (t: number) =>
  t >= T.clave ? BLANCO : t >= T.resultado ? ROJO : t >= T.rendimiento ? AMBAR : t >= T.proceso ? VERDE : BLANCO;

// Zona libre de arriba (la pared). Antes del semáforo se usa todo el ancho;
// después, el semáforo ocupa la izquierda y el contenido va a su derecha.
const ZonaAncha: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{ top: 80, height: 440, justifyContent: "center", alignItems: "center" }}
  >
    {children}
  </AbsoluteFill>
);

const ZonaContenido: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      top: 80,
      left: 236,
      right: 30,
      width: "auto",
      height: 440,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: 18,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Fila: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 14 }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "center" }}>{children}</div>
);

// Zoom suave en cada cambio de luz (plano abierto / cercano alternos). Sin filtros.
const useZoom = () => {
  const frame = useCurrentFrame();
  const cambios = [T.clasificacion, T.proceso, T.rendimiento, T.resultado, T.clave];
  let zoom = 1;
  let previo = 1;
  cambios.forEach((c, i) => {
    const objetivo = i % 2 === 0 ? 1.07 : 1.0;
    if (frame >= s(c)) {
      zoom = interpolate(frame, [s(c), s(c) + 8], [previo, objetivo], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
    }
    previo = objetivo;
  });
  return zoom;
};

const BarraProgresoColor: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const color = colorEn(frame / FPS);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 12,
        width: (width * frame) / Math.max(1, durationInFrames - 1),
        backgroundColor: color === BLANCO ? AMBAR : color,
        boxShadow: `0 0 12px ${color}`,
      }}
    />
  );
};

export const Objetivos: React.FC<ObjetivosProps> = ({ video, llamadaFinal }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const zoom = useZoom();
  const entradaSemaforo = useEntradaSemaforo(s(T.semaforo));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 35%" }}>
        <OffthreadVideo
          src={staticFile(video)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* 0–8,7 s: se acaba el año, frustración y la meta de −20 kg */}
      <Tramo desde={T.intro} hasta={T.meta}>
        <ZonaAncha>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <Calendario desde={0} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Titulo texto="Se acaba el año…" color={BLANCO} tamano={60} />
              <Item texto="Frustración" tipo="cruz" desde={s(3.4)} />
              <Item texto="Fracaso" tipo="cruz" desde={s(4.3)} />
            </div>
          </div>
        </ZonaAncha>
      </Tramo>
      <Tramo desde={T.meta} hasta={T.tipo - 0.3}>
        <ZonaAncha>
          <MetaTachada desde={0} />
        </ZonaAncha>
      </Tramo>

      {/* 9–13,4 s: depende del tipo de objetivo */}
      <Tramo desde={T.tipo} hasta={T.clasificacion}>
        <ZonaAncha>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Diana desde={0} />
            <Titulo texto={"Depende del\ntipo de objetivo"} color={BLANCO} tamano={56} desde={s(1.2)} />
          </div>
        </ZonaAncha>
      </Tramo>

      {/* Desde 15 s: el semáforo se queda a la izquierda */}
      {frame >= s(T.semaforo) ? (
        <div style={{ position: "absolute", left: 36, top: 100 }}>
          <Semaforo encendidas={lucesEn(t)} entrada={entradaSemaforo} alto={400} />
        </div>
      ) : null}

      {/* 13,5–23,3 s: clasificación de 3 objetivos según el control */}
      <Tramo desde={T.clasificacion + 0.3} hasta={T.proceso}>
        <ZonaContenido>
          <Titulo
            etiqueta="PSICOLOGÍA DEL DEPORTE"
            texto="3 tipos de objetivos"
            color={BLANCO}
            tamano={58}
            desde={s(1.2)}
          />
          <BarraControl desde={s(5.0)} ancho={600} />
        </ZonaContenido>
      </Tramo>

      {/* 🟢 23,4–41,5 s: objetivos de proceso */}
      <Tramo desde={T.proceso} hasta={T.rendimiento}>
        <ZonaContenido>
          <Titulo etiqueta="OBJETIVO 1" texto="De proceso" color={VERDE} desde={s(1.2)} />
          <Sequence durationInFrames={s(13.4)} layout="none">
            <Fila>
              <Item texto="Esfuerzo" tipo="check" desde={s(5.2)} />
              <Item texto="Técnica" tipo="check" desde={s(6.2)} />
              <Item texto="Pequeños pasos" tipo="check" desde={s(8.0)} />
              <Item texto="Actitud" tipo="check" desde={s(10.4)} />
            </Fila>
          </Sequence>
          <Sequence from={s(13.4)} layout="none">
            <Item texto="Ir a entrenar ya es ganar" tipo="check" desde={s(1.2)} tamano={44} />
          </Sequence>
        </ZonaContenido>
      </Tramo>

      {/* 🟡 41,5–61 s: objetivos de rendimiento */}
      <Tramo desde={T.rendimiento} hasta={T.resultado}>
        <ZonaContenido>
          <Titulo etiqueta="OBJETIVO 2" texto="De rendimiento" color={AMBAR} desde={s(1.4)} />
          <Sequence from={s(5.5)} durationInFrames={s(2.6)} layout="none">
            <Item texto="Tus marcas personales" tipo="punto" color={AMBAR} desde={0} />
          </Sequence>
          <Sequence from={s(8.1)} durationInFrames={s(5.5)} layout="none">
            <BarrasPeso desde={0} />
          </Sequence>
          <Sequence from={s(13.6)} layout="none">
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Diario desde={0} />
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Item texto="Tu diario de entreno" tipo="punto" color={AMBAR} desde={s(1.0)} tamano={36} />
                <Item texto="Busca mejoras" tipo="check" color={AMBAR} desde={s(4.4)} tamano={36} />
              </div>
            </div>
          </Sequence>
        </ZonaContenido>
      </Tramo>

      {/* 🔴 61–83,3 s: objetivos de resultado */}
      <Tramo desde={T.resultado} hasta={T.clave}>
        <ZonaContenido>
          <Titulo
            etiqueta="OBJETIVO 3"
            texto="De resultado"
            color={ROJO}
            colorTexto={BLANCO}
            desde={s(1.0)}
          />
          <Sequence from={s(2.5)} durationInFrames={s(9.5)} layout="none">
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Advertencia desde={0} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Item texto="No te centres tanto" tipo="cruz" desde={s(0.6)} tamano={36} />
                <Item texto="Menos si estás empezando" tipo="punto" color={ROJO} desde={s(5.5)} tamano={34} />
              </div>
            </div>
          </Sequence>
          <Sequence from={s(12.0)} layout="none">
            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <Comparacion desde={s(1.8)} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Item texto="Otras personas" tipo="cruz" desde={s(3.3)} tamano={34} />
                <Item texto="Tu cuerpo" tipo="cruz" desde={s(5.4)} tamano={34} />
                <Item texto="Tu proceso" tipo="cruz" desde={s(8.6)} tamano={34} />
              </div>
            </div>
          </Sequence>
        </ZonaContenido>
      </Tramo>

      {/* 83,3 s–final: la clave es diversificar */}
      <Tramo desde={T.clave}>
        <ZonaContenido>
          <Titulo etiqueta="LA CLAVE" texto="Combina los 3" color={BLANCO} desde={s(0.6)} />
          <Fila gap={10}>
            <Item texto="Metas realistas" tipo="check" desde={s(3.8)} tamano={32} />
            <Item texto="No te compares" tipo="check" desde={s(6.2)} tamano={32} />
            <Item texto="Tu proceso es tuyo" tipo="check" desde={s(8.0)} tamano={32} />
            <Item texto="Agradece a tu cuerpo" tipo="check" desde={s(10.6)} tamano={32} />
          </Fila>
        </ZonaContenido>
        <Sequence from={s(12.8)} layout="none">
          <AbsoluteFill
            style={{ top: 1700, height: 150, justifyContent: "center", alignItems: "center" }}
          >
            <Item texto={llamadaFinal} tipo="check" color={VERDE} desde={0} tamano={40} />
          </AbsoluteFill>
        </Sequence>
      </Tramo>

      <BarraProgresoColor />
    </AbsoluteFill>
  );
};
