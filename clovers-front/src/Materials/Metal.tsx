import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
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
  path: R.Path;
  setState: any;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>Metal</h3>
      <DeleteButton path={path} setState={setState} />
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
