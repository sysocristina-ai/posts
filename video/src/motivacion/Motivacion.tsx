import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FPS } from "../flexibilidad/estilo";
import { Diario } from "../objetivos/graficos";
import { Item, Titulo } from "../objetivos/graficos";
import { Bateria, COLORES_NIVEL } from "./Bateria";
import { BlancoONegro, Chispa, Comenta, Encuesta, QuieroOMeToca } from "./graficos";
import { cortesMotivacion } from "./cortes";

export type MotivacionProps = { video: string; cortes: [number, number][] };

const fr = (s: number) => Math.round(s * FPS);

// Convierte un instante del vídeo original (s) al frame del vídeo ya cortado.
const crearMapa = (cortes: [number, number][]) => (t: number) => {
  let acumulado = 0;
  for (const [a, b] of cortes) {
    if (t < a) return fr(acumulado);
    if (t <= b) return fr(acumulado + (t - a));
    acumulado += b - a;
  }
  return fr(acumulado);
};

export const duracionMotivacion = (cortes: [number, number][]) =>
  cortes.reduce((t, [a, b]) => t + fr(b - a), 0);

// Nivel de la batería según el instante original, con carga animada entre niveles.
const NIVELES: [number, number][] = [
  [17.75, 1],
  [32.75, 2],
  [49.25, 3],
  [64.6, 4],
  [84.4, 5],
];

const Plano: React.FC<{ video: string; desde: number; hasta: number; cercano: boolean }> = ({
  video,
  desde,
  hasta,
  cercano,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = (cercano ? 1.09 : 1.0) + interpolate(frame, [0, durationInFrames], [0, 0.02]);
  return (
    // origen arriba: al acercar, la cara baja y deja libre la zona de los gráficos
    <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 0%" }}>
      <OffthreadVideo
        src={staticFile(video)}
        trimBefore={fr(desde)}
        trimAfter={fr(hasta)}
        volume={(f) =>
          interpolate(f, [0, 2, durationInFrames - 3, durationInFrames - 1], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

const ZonaAncha: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ top: 60, height: 380, justifyContent: "center", alignItems: "center" }}>
    {children}
  </AbsoluteFill>
);

const ZonaContenido: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      top: 60,
      left: 225,
      right: 24,
      width: "auto",
      height: 380,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: 14,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Motivacion: React.FC<MotivacionProps> = ({ video, cortes }) => {
  const frame = useCurrentFrame();
  const { width, durationInFrames } = useVideoConfig();
  const m = crearMapa(cortes);

  // Tramo en tiempos del vídeo original; dentro, `r(t)` da el frame relativo.
  const Tramo: React.FC<{
    desde: number;
    hasta?: number;
    children: (r: (t: number) => number) => React.ReactNode;
  }> = ({ desde, hasta, children }) => (
    <Sequence
      from={m(desde)}
      durationInFrames={hasta === undefined ? undefined : Math.max(1, m(hasta) - m(desde))}
      layout="none"
    >
      {children((t) => m(t) - m(desde))}
    </Sequence>
  );

  // batería
  let nivel = 0;
  for (const [t, n] of NIVELES) {
    const f = m(t);
    if (frame >= f) nivel = (n - 1) + interpolate(frame, [f, f + 14], [0, 1], { extrapolateRight: "clamp" });
  }
  const entradaBateria = interpolate(frame, [m(16.0), m(16.0) + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const colorNivel = COLORES_NIVEL[Math.max(0, Math.ceil(nivel) - 1)];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        {cortes.map(([a, b], i) => (
          <Series.Sequence key={i} durationInFrames={fr(b - a)}>
            <Plano video={video} desde={a} hasta={b} cercano={i % 2 === 1} />
          </Series.Sequence>
        ))}
      </Series>

      {/* Gancho */}
      <Tramo desde={0.41} hasta={4.6}>
        {(r) => (
          <ZonaAncha>
            <QuieroOMeToca desdeToca={r(3.25)} />
          </ZonaAncha>
        )}
      </Tramo>

      {/* Módulo de estudio */}
      <Tramo desde={4.97} hasta={9.9}>
        {(r) => (
          <ZonaAncha>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <Diario desde={0} />
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Titulo etiqueta="ACOMPÁÑAME A ESTUDIAR" texto="Psicología deportiva" color="#FFFFFF" tamano={52} desde={r(6.2)} />
                <Item texto="Módulo para un examen" tipo="check" color="#22C55E" desde={r(8.2)} tamano={36} />
              </div>
            </div>
          </ZonaAncha>
        )}
      </Tramo>

      {/* No todo es blanco o negro */}
      <Tramo desde={9.9} hasta={14.7}>
        {(r) => (
          <ZonaAncha>
            <BlancoONegro desdeMatices={r(12.6)} />
          </ZonaAncha>
        )}
      </Tramo>

      {/* Tipos de motivación */}
      <Tramo desde={14.7} hasta={17.73}>
        {() => (
          <ZonaContenido>
            <Titulo etiqueta="VAMOS A ESTUDIAR" texto={"Los tipos de\nmotivación"} color="#FFFFFF" tamano={54} />
          </ZonaContenido>
        )}
      </Tramo>

      {/* Batería: se queda a la izquierda desde aquí */}
      {frame >= m(16.0) ? (
        <div style={{ position: "absolute", left: 30, top: 66 }}>
          <Bateria nivel={nivel} entrada={entradaBateria} alto={300} />
        </div>
      ) : null}

      {/* NIVEL 1 */}
      <Tramo desde={17.73} hasta={21.2}>
        {() => (
          <ZonaContenido>
            <Titulo etiqueta="NIVEL 1" texto="El más bajo" color={COLORES_NIVEL[0]} />
          </ZonaContenido>
        )}
      </Tramo>
      <Tramo desde={21.2} hasta={31.97}>
        {(r) => (
          <ZonaContenido>
            <Titulo etiqueta="NIVEL 1" texto="Amotivación" color={COLORES_NIVEL[0]} />
            <Item texto="Sin deseo de entrenar" tipo="cruz" desde={r(25.7)} tamano={36} />
            <Item texto="Ni motivación externa ni interna" tipo="cruz" desde={r(29.3)} tamano={32} />
          </ZonaContenido>
        )}
      </Tramo>

      {/* NIVEL 2 */}
      <Tramo desde={31.97} hasta={47.87}>
        {(r) => (
          <ZonaContenido>
            <Titulo etiqueta="NIVEL 2" texto="Regulación externa" color={COLORES_NIVEL[1]} colorTexto="#fff" tamano={52} desde={r(32.75)} />
            <Sequence from={r(34.4)} durationInFrames={r(39.9) - r(34.4)} layout="none">
              <div style={{ display: "flex", gap: 12 }}>
                <Item texto="Castigo" tipo="cruz" desde={r(35.2) - r(34.4)} tamano={36} />
                <Item texto="Obligación" tipo="cruz" desde={r(38.0) - r(34.4)} tamano={36} />
              </div>
            </Sequence>
            <Sequence from={r(39.9)} layout="none">
              <Item texto={"Ej.: te inscriben «porque sí o sí»"} tipo="punto" color={COLORES_NIVEL[1]} desde={r(40.2) - r(39.9)} tamano={32} />
            </Sequence>
          </ZonaContenido>
        )}
      </Tramo>

      {/* NIVEL 3 */}
      <Tramo desde={47.87} hasta={62.77}>
        {(r) => (
          <ZonaContenido>
            <Titulo etiqueta="NIVEL 3" texto={"Regulación\nintroyectada"} color={COLORES_NIVEL[2]} tamano={48} desde={r(49.2)} />
            <Sequence from={r(51.9)} durationInFrames={r(57.4) - r(51.9)} layout="none">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Item texto="Entrenas para complacer a otros" tipo="punto" color={COLORES_NIVEL[2]} desde={0} tamano={32} />
                <Item texto="Sin castigo ni obligación" tipo="punto" color={COLORES_NIVEL[2]} desde={r(55.0) - r(51.9)} tamano={32} />
              </div>
            </Sequence>
            <Sequence from={r(57.4)} layout="none">
              <Item texto="Pero no porque tú quieras" tipo="cruz" desde={0} tamano={34} />
            </Sequence>
          </ZonaContenido>
        )}
      </Tramo>

      {/* NIVEL 4 */}
      <Tramo desde={63.55} hasta={79.63}>
        {(r) => (
          <ZonaContenido>
            <Titulo etiqueta="NIVEL 4" texto={"Regulación\nidentificada"} color={COLORES_NIVEL[3]} tamano={48} desde={r(64.6)} />
            <Sequence from={r(66.6)} durationInFrames={r(70.5) - r(66.6)} layout="none">
              <Item texto="Entiendes sus beneficios" tipo="check" color={COLORES_NIVEL[4]} desde={0} tamano={34} />
            </Sequence>
            <Sequence from={r(70.5)} durationInFrames={r(75.25) - r(70.5)} layout="none">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Chispa desde={r(72.9) - r(70.5)} encendida={false} tamano={84} />
                <Item texto="…pero sin chispa interna" tipo="cruz" desde={r(72.9) - r(70.5)} tamano={34} />
              </div>
            </Sequence>
            <Sequence from={r(75.25)} layout="none">
              <Item texto="Solo sigues una instrucción" tipo="punto" color={COLORES_NIVEL[3]} desde={r(76.4) - r(75.25)} tamano={34} />
            </Sequence>
          </ZonaContenido>
        )}
      </Tramo>

      {/* NIVEL 5 */}
      <Tramo desde={79.63} hasta={84.03}>
        {(r) => (
          <ZonaContenido>
            <Titulo etiqueta="Y POR ÚLTIMO…" texto={"El nivel al que\ntodos aspiramos"} color="#FFFFFF" tamano={48} desde={r(80.5)} />
          </ZonaContenido>
        )}
      </Tramo>
      <Tramo desde={84.03} hasta={94.41}>
        {(r) => (
          <ZonaContenido>
            <Titulo etiqueta="NIVEL 5" texto={"Regulación\nintegrada"} color={COLORES_NIVEL[4]} tamano={48} desde={r(84.4)} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Chispa desde={r(86.3)} encendida tamano={90} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Item texto="Conoces los beneficios" tipo="check" color={COLORES_NIVEL[4]} desde={r(87.0)} tamano={30} />
                <Item texto="Te los apropias" tipo="check" color={COLORES_NIVEL[4]} desde={r(89.9)} tamano={30} />
                <Item texto="Eliges entrenar" tipo="check" color={COLORES_NIVEL[4]} desde={r(91.0)} tamano={30} />
              </div>
            </div>
          </ZonaContenido>
        )}
      </Tramo>

      {/* Llamada a comentar */}
      <Tramo desde={94.41} hasta={101.0}>
        {(r) => (
          <ZonaContenido>
            <Titulo etiqueta="DIME EN COMENTARIOS" texto="¿En qué nivel estás?" color="#FFFFFF" tamano={50} />
            <Encuesta desde={r(96.2)} />
          </ZonaContenido>
        )}
      </Tramo>
      <Tramo desde={95.2}>
        {() => (
          <AbsoluteFill style={{ top: 1690, height: 160, justifyContent: "center", alignItems: "center" }}>
            <Comenta texto="Comenta tu número del 1 al 5" />
          </AbsoluteFill>
        )}
      </Tramo>

      {/* Cierre */}
      <Tramo desde={101.0}>
        {(r) => (
          <ZonaContenido>
            <Titulo etiqueta="HAZTE ESTE AUTODIAGNÓSTICO" texto={"Para tener\nautodeterminación"} color={COLORES_NIVEL[4]} tamano={48} desde={r(102.3)} />
            <Item texto="…y cumplir tus metas" tipo="check" color={COLORES_NIVEL[4]} desde={r(106.0)} tamano={34} />
          </ZonaContenido>
        )}
      </Tramo>

      {/* Barra de progreso con el color del nivel actual */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 12,
          width: (width * frame) / Math.max(1, durationInFrames - 1),
          backgroundColor: nivel > 0 ? colorNivel : "#FFD60A",
          boxShadow: `0 0 12px ${nivel > 0 ? colorNivel : "#FFD60A"}`,
        }}
      />
    </AbsoluteFill>
  );
};

export const propsMotivacion: MotivacionProps = { video: "motivacion.mp4", cortes: cortesMotivacion };
