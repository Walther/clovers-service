import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { NumberInput } from "../Inputs/Number";
import { TextInput } from "../Inputs/Text";
import { CheckboxInput } from "../Inputs/Checkbox";
import { ObjectForm } from "./SceneObject";

export type RotateY = {
  kind: "RotateY";
  comment?: string;
  object: any;
  angle: number;
  priority: boolean;
};

export const RotateYForm = ({
  object,
  path,
  setState,
}: {
  object: RotateY;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<RotateY>>;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>RotateY</h3>
      <DeleteButton path={path} setState={setState} />
      <TextInput
        tooltip="descriptive comment or name of the object"
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        tooltip="rotation angle, in degrees"
        fieldname="angle"
        object={object}
        path={path}
        setState={setState}
      />
      <CheckboxInput
        tooltip="prioritize object in multiple importance sampling"
        fieldname="priority"
        object={object}
        path={path}
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
