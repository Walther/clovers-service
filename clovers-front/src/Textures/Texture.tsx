import * as R from "ramda";
import { ReactElement, useId, useState } from "react";
import { Button } from "../Button";
import { SolidColorForm } from "./SolidColor";
import { SpatialCheckerForm } from "./SpatialChecker";
import { SurfaceCheckerForm } from "./SurfaceChecker";

// TODO: proper type
export type Texture = any;

const SceneTextureNames = ["SolidColor", "SpatialChecker", "SurfaceChecker"];

const DebugForm = ({ texture }: { texture: Texture }): ReactElement => {
  const id = useId();
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <label htmlFor={id}>json: </label>
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
  path: any; // TODO: ramda path type
  setState: Function;
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

export const TextureSelect = ({
  id,
  selected,
  setSelected,
}: {
  id: any;
  selected: any;
  setSelected: any;
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
  setState: Function;
  path: any; // TODO: type for ramda path
}): ReactElement => {
  const id = useId();
  const [selected, setSelected] = useState("SolidColor");

  return (
    <>
      <label htmlFor={id}>new texture: </label>
      <TextureSelect id={id} selected={selected} setSelected={setSelected} />
      <Button
        handleClick={() =>
          setState((prevState: any) => {
            const lens: any = R.lensPath(path);
            const value: any = R.view(lens, prevState);
            const valueType = R.type(value);
            switch (valueType) {
              case "Array":
                return R.prepend({ [selected]: {} }, prevState);
              case "Undefined":
                return R.assocPath(path, { [selected]: {} }, prevState);
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
