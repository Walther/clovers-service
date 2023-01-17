import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { CheckboxInput, TextInput } from "../Input";
import { ObjectForm } from "./SceneObject";

export type FlipFace = {
  comment?: string;
  object: any;
};

export const FlipFaceForm = ({
  object,
  path,
  setState,
}: {
  object: FlipFace;
  path: R.Path;
  setState: any;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>FlipFace</h3>
      <DeleteButton path={path} setState={setState} />
      <TextInput
        fieldname="comment"
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
      <ObjectForm path={path} object={object.object} setState={setState} />
    </div>
  );
};
