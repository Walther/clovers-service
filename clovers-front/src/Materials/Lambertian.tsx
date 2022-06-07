import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { Texture, TextureForm } from "../Textures/Texture";

export type Lambertian = {
  albedo: Texture;
};

export const LambertianForm = ({
  material,
  path,
  setState,
}: {
  material: Lambertian;
  path: any; // TODO: ramda path type
  setState: Function;
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
