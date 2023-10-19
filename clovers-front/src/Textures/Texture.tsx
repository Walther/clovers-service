import * as R from "ramda";
import { ReactElement, useId, useState } from "react";
import { Button } from "../Inputs/Button";
import { SolidColor, SolidColorForm } from "./SolidColor";
import { SpatialChecker, SpatialCheckerForm } from "./SpatialChecker";
import { SurfaceChecker, SurfaceCheckerForm } from "./SurfaceChecker";

export type Texture = SolidColor | SpatialChecker | SurfaceChecker;

const SceneTextureNames = ["SolidColor", "SpatialChecker", "SurfaceChecker"];

const DebugForm = ({ texture }: { texture: Texture }): ReactElement => {
  const id = useId();
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <label title="json for the unknown texture" htmlFor={id}>
        json:
      </label>
      <input id={id} type="text" value={JSON.stringify(texture)} readOnly />
    </div>
  );
};

export const TextureForm = ({
  texture,
  path,
  setState,
}: {
  texture: Texture;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<any>>;
}): ReactElement => {
  if (!texture) {
    return (
      <div className="OptionsForm">
        <h3>default texture</h3>
        <NewTextureForm setState={setState} path={path} />
      </div>
    );
  }
  // TODO: can this be done better somehow?
  switch (texture.kind) {
    case "SolidColor":
      return (
        <SolidColorForm texture={texture} path={path} setState={setState} />
      );
    case "SurfaceChecker":
      return (
        <SurfaceCheckerForm texture={texture} path={path} setState={setState} />
      );
    case "SpatialChecker":
      return (
        <SpatialCheckerForm texture={texture} path={path} setState={setState} />
      );
    default:
      return <DebugForm texture={texture} />;
  }
};

export const TextureSelect = ({
  id,
  selected,
  setSelected,
}: {
  id: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}): ReactElement => {
  const options = SceneTextureNames.map((name, index) => (
    <option value={name} key={index}>
      {name}
    </option>
  ));
  return (
    <select
      id={id}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
    >
      {options}
    </select>
  );
};

export const NewTextureForm = ({
  setState,
  path,
}: {
  setState: React.Dispatch<React.SetStateAction<Texture>>;
  path: R.Path;
}): ReactElement => {
  const id = useId();
  const [selected, setSelected] = useState("SolidColor");

  return (
    <>
      <label title="select the type of the new texture to add" htmlFor={id}>
        new texture:
      </label>
      <TextureSelect id={id} selected={selected} setSelected={setSelected} />
      <Button
        handleClick={() =>
          setState((prevState: any) => {
            const lens: any = R.lensPath(path);
            const value: any = R.view(lens, prevState);
            const valueType = R.type(value);
            switch (valueType) {
              case "Array":
                return R.prepend({ kind: selected }, prevState);
              case "Undefined":
                return R.assocPath(path, { kind: selected }, prevState);
              default:
                console.error("unexpected value type: ", value);
                return prevState;
            }
          })
        }
        text={"add"}
      />
    </>
  );
};
