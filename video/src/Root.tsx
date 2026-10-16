import { Composition } from "remotion";
import { MiVideo } from "./MiVideo";
import { Flexibilidad, calcularMetadatos } from "./flexibilidad/Flexibilidad";
import { Objetivos, calcularMetadatosObjetivos } from "./objetivos/Objetivos";
import { Motivacion, duracionMotivacion, propsMotivacion } from "./motivacion/Motivacion";
import { UnionClips, calcularDuracionUnion } from "./clips/UnionClips";
import { cortes1014y1015 } from "./clips/reel-1014-1015";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Flexibilidad"
        component={Flexibilidad}
        durationInFrames={792}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          video: "1009.mp4",
          llamadaFinal: "Sígueme para más",
        }}
        calculateMetadata={calcularMetadatos}
      />
      <Composition
        id="Motivacion"
        component={Motivacion}
        durationInFrames={duracionMotivacion(propsMotivacion.cortes)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={propsMotivacion}
      />
      <Composition
        id="Objetivos"
        component={Objetivos}
        durationInFrames={2945}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ video: "objetivos.mp4", llamadaFinal: "Sígueme para más" }}
        calculateMetadata={calcularMetadatosObjetivos}
      />
      <Composition
        id="Reel1014y1015"
        component={UnionClips}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ cortes: cortes1014y1015 }}
        calculateMetadata={calcularDuracionUnion}
      />
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
    </>
  );
};
