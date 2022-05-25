import { ReactElement } from "react";
import { Texture, TextureForm } from "../Textures/Texture";

export type Isotropic = {
  albedo: Texture;
};

export const IsotropicForm = ({
  material,
}: {
  material: Isotropic;
}): ReactElement => {
  const mat = "Isotropic";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor="type">type: </label>
      <select id="type">
        <option>{mat}</option>
      </select>
      <TextureForm texture={material.albedo} />
    </div>
  );
};
