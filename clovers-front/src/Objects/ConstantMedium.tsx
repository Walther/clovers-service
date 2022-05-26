import { ReactElement } from "react";
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
  return (
    <div className="OptionsForm">
      <h3>constant medium</h3>
      <TextInput
        fieldname="comment"
        object={object}
        path={[...path, "comment"]}
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
