import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { Texture, TextureForm } from "../Textures/Texture";
import { TextInput } from "../Inputs/Text";

export type Isotropic = {
  kind: "Isotropic";
  albedo: Texture;
  name: string;
};

export const IsotropicForm = ({
  material,
  path,
  setState,
}: {
  material: Isotropic;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<Isotropic>>;
}): ReactElement => {
  const kind = "Isotropic";
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
