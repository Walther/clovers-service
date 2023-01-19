import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { NumberInput } from "../Inputs/Number";
import { Texture, TextureForm } from "../Textures/Texture";

export type Metal = {
  kind: "Metal";
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
  setState: React.Dispatch<React.SetStateAction<Metal>>;
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
