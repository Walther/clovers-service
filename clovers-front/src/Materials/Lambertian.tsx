import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { Texture, TextureForm } from "../Textures/Texture";

export type Lambertian = {
  kind: "Lambertian";
  albedo: Texture;
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
  const mat = "Lambertian";
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
