import { ReactElement } from "react";
import { TextInput, NumberInput } from "../Input";
import { ObjectForm } from "./SceneObject";

export type Rotate = {
  comment?: string;
  object: any;
  angle: number;
};

export const RotateYForm = ({
  object,
  path,
  setState,
}: {
  object: Rotate;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>rotate y</h3>
      <TextInput
        fieldname="comment"
        object={object}
        path={[...path, "comment"]}
        setState={setState}
      />
      <NumberInput
        fieldname="angle"
        object={object}
        path={[...path, "angle"]}
        setState={setState}
      />
      <ObjectForm
        object={object.object}
        setState={setState}
        path={[...path, "object"]}
      />
    </div>
  );
};
