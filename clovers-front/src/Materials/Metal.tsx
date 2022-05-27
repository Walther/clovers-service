import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { NumberInput } from "../Input";
import { Texture, TextureForm } from "../Textures/Texture";

export type Metal = {
  albedo: Texture;
  fuzz: number;
};

export const MetalForm = ({
  material,
  path,
  setState,
}: {
  material: Metal;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const mat = "Metal";
  // removing the title from the path for deleting; TODO: remove when adding `kind` to objects and reducing nesting in upstream
  const deletePath = path.slice(0, -1);
  return (
    <div className="OptionsForm">
      <h3>{mat}</h3>
      <DeleteButton path={deletePath} setState={setState} />
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
