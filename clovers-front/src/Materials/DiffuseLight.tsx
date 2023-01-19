import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { Texture, TextureForm } from "../Textures/Texture";

export type DiffuseLight = {
  kind: "DiffuseLight";
  emit: Texture;
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
  const mat = "DiffuseLight";
  return (
    <div className="OptionsForm">
      <h3>{mat}</h3>
      <DeleteButton path={path} setState={setState} />
      <TextureForm
        texture={material.emit}
        path={[...path, "emit"]}
        setState={setState}
      />
    </div>
  );
};
