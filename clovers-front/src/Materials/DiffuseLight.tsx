import { ReactElement } from "react";
import { Texture, TextureForm } from "../Textures/Texture";

export type DiffuseLight = {
  emit: Texture;
};

export const DiffuseLightForm = ({
  material,
}: {
  material: DiffuseLight;
}): ReactElement => {
  const mat = "DiffuseLight";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor="type">type: </label>
      <select id="type">
        <option>{mat}</option>
      </select>
      <TextureForm texture={material.emit} />
    </div>
  );
};
