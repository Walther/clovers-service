import { ReactElement } from "react";
import { TextInput } from "../Input";
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
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>flip face</h3>
      <TextInput
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <ObjectForm path={path} object={object.object} setState={setState} />
    </div>
  );
};
