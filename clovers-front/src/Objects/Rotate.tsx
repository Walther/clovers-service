import { ReactElement } from "react";
import { Input } from "../Input";
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
      <Input
        fieldname="comment"
        object={object}
        path={[...path, "comment"]}
        setState={setState}
      />
      <Input
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
