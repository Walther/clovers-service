import { ReactElement } from "react";
import { Texture, TextureForm } from "../Textures/Texture";

export type Lambertian = {
  albedo: Texture;
};

export const LambertianForm = ({
  material,
}: {
  material: Lambertian;
}): ReactElement => {
  const mat = "Lambertian";
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
