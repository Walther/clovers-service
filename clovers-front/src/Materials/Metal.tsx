import { ReactElement, useId } from "react";
import { Input } from "../Input";
import { Texture, TextureForm } from "../Textures/Texture";

export type Metal = {
  albedo: Texture;
  fuzz: number;
};

export const MetalForm = ({ material }: { material: Metal }): ReactElement => {
  const id = useId();
  const mat = "Metal";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>{mat}</option>
      </select>
      <Input fieldname="fuzz" object={material} />
      <TextureForm texture={material.albedo} />
    </div>
  );
};
