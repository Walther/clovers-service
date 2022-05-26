import { ReactElement, useId } from "react";
import { Texture, TextureForm } from "../Textures/Texture";

export type Isotropic = {
  albedo: Texture;
};

export const IsotropicForm = ({
  material,
  path,
  setState,
}: {
  material: Isotropic;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const id = useId();
  const mat = "Isotropic";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>{mat}</option>
      </select>
      <TextureForm
        texture={material.albedo}
        path={[...path, "albedo"]}
        setState={setState}
      />
    </div>
  );
};
