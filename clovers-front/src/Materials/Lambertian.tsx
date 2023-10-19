import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { Texture, TextureForm } from "../Textures/Texture";
import { TextInput } from "../Inputs/Text";

export type Lambertian = {
  kind: "Lambertian";
  albedo: Texture;
  name: string;
};

export const LambertianForm = ({
  material,
  path,
  setState,
}: {
  material: Lambertian;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<Lambertian>>;
}): ReactElement => {
  const kind = "Lambertian";
  return (
    <div className="OptionsForm">
      <h3>{material.name || kind}</h3>
      <TextInput
        tooltip="unique name of the material"
        fieldname="name"
        object={material}
        path={path}
        setState={setState}
      />
      <DeleteButton path={path} setState={setState} />
      <TextureForm
        texture={material.albedo}
        path={[...path, "albedo"]}
        setState={setState}
      />
    </div>
  );
};
