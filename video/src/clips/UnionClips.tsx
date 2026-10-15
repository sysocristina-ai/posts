import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  OffthreadVideo,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BarraProgreso } from "../flexibilidad/piezas";
import { NEGRO } from "../flexibilidad/estilo";

export type Corte = { video: string; desde: number; hasta: number };

export type UnionClipsProps = { cortes: Corte[] };

const FPS = 30;
const frames = (c: Corte) => Math.max(1, Math.round((c.hasta - c.desde) * FPS));

export const calcularDuracionUnion: CalculateMetadataFunction<UnionClipsProps> = ({
  props,
}) => ({
  durationInFrames: props.cortes.reduce((t, c) => t + frames(c), 0),
});

// Un tramo: zoom alterno (plano abierto / plano cercano) para disimular el corte,
// con un acercamiento lento y un fundido de audio muy corto para evitar chasquidos.
const Tramo: React.FC<{ corte: Corte; cercano: boolean }> = ({ corte, cercano }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const base = cercano ? 1.14 : 1.0;
  const zoom = base + interpolate(frame, [0, durationInFrames], [0, 0.03]);
  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 28%" }}>
      <OffthreadVideo
        src={staticFile(corte.video)}
        trimBefore={Math.round(corte.desde * FPS)}
        trimAfter={Math.round(corte.hasta * FPS)}
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

export const UnionClips: React.FC<UnionClipsProps> = ({ cortes }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: NEGRO }}>
      <Series>
        {cortes.map((c, i) => (
          <Series.Sequence key={i} durationInFrames={frames(c)}>
            <Tramo corte={c} cercano={i % 2 === 1} />
          </Series.Sequence>
        ))}
      </Series>
      <BarraProgreso />
    </AbsoluteFill>
  );
};
