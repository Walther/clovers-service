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
  // removing the title from the path for deleting; TODO: remove when adding `kind` to objects and reducing nesting in upstream
  const deletePath = path.slice(0, -1);
  return (
    <div className="OptionsForm">
      <h3>{mat}</h3>
      <DeleteButton path={deletePath} setState={setState} />
      <TextureForm
        texture={material.albedo}
        path={[...path, "albedo"]}
        setState={setState}
      />
    </div>
  );
};
