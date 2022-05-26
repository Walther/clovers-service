import { ReactElement, useId } from "react";
import { NumberInput } from "../Input";
import { Texture, TextureForm } from "../Textures/Texture";

export type Metal = {
  albedo: Texture;
  fuzz: number;
};

export const MetalForm = ({
  material,
  path,
  setState,
}: {
  material: Metal;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const id = useId();
  const mat = "Metal";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>{mat}</option>
      </select>
      <NumberInput
        fieldname="fuzz"
        object={material}
        path={path}
        setState={setState}
      />
      <TextureForm
        texture={material.albedo}
        path={[...path, "albedo"]}
        setState={setState}
      />
    </div>
  );
};
