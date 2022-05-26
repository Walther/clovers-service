import { ReactElement, useId } from "react";
import { Texture, TextureForm } from "../Textures/Texture";

export type DiffuseLight = {
  emit: Texture;
};

export const DiffuseLightForm = ({
  material,
  path,
  setState,
}: {
  material: DiffuseLight;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const id = useId();
  const mat = "DiffuseLight";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>{mat}</option>
      </select>
      <TextureForm
        texture={material.emit}
        path={[...path, "emit"]}
        setState={setState}
      />
    </div>
  );
};
