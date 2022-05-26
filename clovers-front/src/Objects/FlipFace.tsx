import { ReactElement } from "react";
import { Input } from "../Input";
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
      <Input
        fieldname="comment"
        object={object}
        path={[...path, "comment"]}
        setState={setState}
      />
      <ObjectForm
        path={[...path, "object"]}
        object={object.object}
        setState={setState}
      />
    </div>
  );
};
