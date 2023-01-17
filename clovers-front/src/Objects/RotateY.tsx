import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { TextInput, NumberInput, CheckboxInput } from "../Input";
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
  setState: any;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>RotateY</h3>
      <DeleteButton path={path} setState={setState} />
      <TextInput
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        fieldname="angle"
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
        object={object.object}
        setState={setState}
        path={[...path, "object"]}
      />
    </div>
  );
};
