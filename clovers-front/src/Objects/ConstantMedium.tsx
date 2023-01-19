import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { NumberInput } from "../Inputs/Number";
import { TextInput } from "../Inputs/Text";
import { CheckboxInput } from "../Inputs/Checkbox";
import { ObjectForm, SceneObject } from "./SceneObject";
import { Texture, TextureForm } from "../Textures/Texture";

export type ConstantMedium = {
  kind: "ConstantMedium";
  comment?: string;
  density: number;
  boundary: SceneObject;
  texture: Texture;
  priority: boolean;
};

export const ConstantMediumForm = ({
  object,
  path,
  setState,
}: {
  object: ConstantMedium;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<ConstantMedium>>;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>ConstantMedium</h3>
      <DeleteButton path={path} setState={setState} />
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
      <CheckboxInput
        fieldname="priority"
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
