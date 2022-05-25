import { ReactElement } from "react";
import { SolidColorForm } from "./SolidColor";
import { SurfaceCheckerForm } from "./SurfaceChecker";

// TODO: proper type
export type Texture = any;

const DebugForm = ({ texture }: { texture: Texture }): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <label htmlFor="json">json: </label>
      <input id="json" type="text" value={JSON.stringify(texture)} />
    </div>
  );
};

export const TextureForm = ({
  texture,
}: {
  texture: Texture;
}): ReactElement => {
  // TODO: can this be done better somehow?
  let kind = Object.keys(texture)[0];
  let txt = texture[kind];
  switch (kind) {
    case "SolidColor":
      return <SolidColorForm texture={txt} />;
    case "SurfaceChecker":
      return <SurfaceCheckerForm texture={txt} />;
    default:
      return <DebugForm texture={txt} />;
  }
};
