import { ReactElement, useId } from "react";
import { SolidColorForm } from "./SolidColor";
import { SpatialCheckerForm } from "./SpatialChecker";
import { SurfaceCheckerForm } from "./SurfaceChecker";

// TODO: proper type
export type Texture = any;

const DebugForm = ({ texture }: { texture: Texture }): ReactElement => {
  const id = useId();
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <label htmlFor={id}>json: </label>
      <input id={id} type="text" value={JSON.stringify(texture)} />
    </div>
  );
};

export const TextureForm = ({
  texture,
  path,
  setState,
}: {
  texture: Texture;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const id = useId();
  if (!texture) {
    return (
      <div className="OptionsForm">
        <h3>texture</h3>
        <label htmlFor={id}>not set: </label>
        <input id={id} type="text" value="default will be used" readOnly />
      </div>
    );
  }
  // TODO: can this be done better somehow?
  let kind = Object.keys(texture)[0];
  let txt = texture[kind];
  switch (kind) {
    case "SolidColor":
      return (
        <SolidColorForm
          texture={txt}
          path={[...path, "SolidColor"]}
          setState={setState}
        />
      );
    case "SurfaceChecker":
      return (
        <SurfaceCheckerForm
          texture={txt}
          path={[...path, "SurfaceChecker"]}
          setState={setState}
        />
      );
    case "SpatialChecker":
      return (
        <SpatialCheckerForm
          texture={txt}
          path={[...path, "SpatialChecker"]}
          setState={setState}
        />
      );
    default:
      return <DebugForm texture={txt} />;
  }
};
