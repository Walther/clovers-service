import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { NumberInput } from "../Inputs/Number";
import { Texture, TextureForm } from "../Textures/Texture";
import { TextInput } from "../Inputs/Text";

export type Metal = {
  kind: "Metal";
  albedo: Texture;
  fuzz: number;
  name: string;
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
  const kind = "Metal";
  return (
    <div className="OptionsForm">
      <h3>{material.name || kind}</h3>
      <TextInput
        fieldname="name"
        object={material}
        path={path}
        setState={setState}
      />
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
