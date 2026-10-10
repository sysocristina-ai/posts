import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type MiVideoProps = {
  titulo: string;
  subtitulo: string;
  colorFondo: string;
  colorTexto: string;
};

// Composición de ejemplo: título que entra con un muelle y subtítulo con fundido.
// Duplica este archivo como punto de partida para tus propios vídeos.
export const MiVideo: React.FC<MiVideoProps> = ({
  titulo,
  subtitulo,
  colorFondo,
  colorTexto,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entrada = spring({ frame, fps, config: { damping: 200 } });
  const opacidadSub = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const salida = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colorFondo,
        color: colorTexto,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Helvetica, Arial, sans-serif",
        textAlign: "center",
        padding: 80,
        opacity: salida,
      }}
    >
      <div
        style={{
          fontSize: 110,
          fontWeight: 700,
          transform: `translateY(${(1 - entrada) * 200}px)`,
          opacity: entrada,
        }}
      >
        {titulo}
      </div>
      <div style={{ fontSize: 56, marginTop: 40, opacity: opacidadSub }}>
        {subtitulo}
      </div>
    </AbsoluteFill>
  );
};
