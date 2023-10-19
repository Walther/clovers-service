import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { Texture, TextureForm } from "../Textures/Texture";
import { TextInput } from "../Inputs/Text";

export type DiffuseLight = {
  kind: "DiffuseLight";
  emit: Texture;
  name: string;
};

export const DiffuseLightForm = ({
  material,
  path,
  setState,
}: {
  material: DiffuseLight;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<DiffuseLight>>;
}): ReactElement => {
  const kind = "DiffuseLight";
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
        texture={material.emit}
        path={[...path, "emit"]}
        setState={setState}
      />
    </div>
  );
};
