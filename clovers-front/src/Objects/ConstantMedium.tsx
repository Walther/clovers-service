import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { TextInput, NumberInput } from "../Input";
import { ObjectForm } from "./SceneObject";
import { TextureForm } from "../Textures/Texture";

export type ConstantMedium = {
  comment?: string;
  density: number;
  boundary: any;
  texture: any;
};

export const ConstantMediumForm = ({
  object,
  path,
  setState,
}: {
  object: ConstantMedium;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  // removing the title from the path for deleting; TODO: remove when adding `kind` to objects and reducing nesting in upstream
  const deletePath = path.slice(0, -1);
  return (
    <div className="OptionsForm">
      <h3>ConstantMedium</h3>
      <DeleteButton path={deletePath} setState={setState} />
      <TextInput
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        fieldname="density"
        object={object}
        path={path}
        setState={setState}
      />
      <ObjectForm
        object={object.boundary}
        path={[...path, "boundary"]}
        setState={setState}
      />
      <TextureForm
        texture={object.texture}
        path={[...path, "texture"]}
        setState={setState}
      />
    </div>
  );
};
