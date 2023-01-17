import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { Texture, TextureForm } from "../Textures/Texture";

export type Isotropic = {
  albedo: Texture;
};

export const IsotropicForm = ({
  material,
  path,
  setState,
}: {
  material: Isotropic;
  path: R.Path;
  setState: any;
}): ReactElement => {
  const mat = "Isotropic";
  return (
    <div className="OptionsForm">
      <h3>{mat}</h3>
      <DeleteButton path={path} setState={setState} />
      <TextureForm
        texture={material.albedo}
        path={[...path, "albedo"]}
        setState={setState}
      />
    </div>
  );
};
