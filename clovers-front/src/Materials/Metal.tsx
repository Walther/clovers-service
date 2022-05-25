import { ReactElement } from "react";
import { Input } from "../Input";
import { Texture, TextureForm } from "../Textures/Texture";

export type Metal = {
  albedo: Texture;
  fuzz: number;
};

export const MetalForm = ({ material }: { material: Metal }): ReactElement => {
  const mat = "Metal";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor="type">type: </label>
      <select id="type">
        <option>{mat}</option>
      </select>
      <Input fieldname="fuzz" object={material} />
      <TextureForm texture={material.albedo} />
    </div>
  );
};
