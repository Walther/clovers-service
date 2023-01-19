import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { TextInput } from "../Inputs/TextInput";
import { CheckboxInput } from "../Inputs/CheckboxInput";
import { ObjectForm, SceneObject } from "./SceneObject";

export type FlipFace = {
  kind: "FlipFace";
  comment?: string;
  object: SceneObject;
  priority: boolean;
};

export const FlipFaceForm = ({
  object,
  path,
  setState,
}: {
  object: FlipFace;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<FlipFace>>;
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
