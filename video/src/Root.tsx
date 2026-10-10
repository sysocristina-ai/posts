import { Composition } from "remotion";
import { MiVideo } from "./MiVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MiVideo"
      component={MiVideo}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        titulo: "Hola desde Remotion",
        subtitulo: "Vídeo generado automáticamente",
        colorFondo: "#111111",
        colorTexto: "#ffffff",
      }}
    />
  );
};
