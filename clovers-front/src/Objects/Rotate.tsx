import { ReactElement } from "react";
import { Input } from "../Input";
import { ObjectForm } from "./SceneObject";
import * as R from "ramda";

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
  const commentLens = R.lensPath([...path, "comment"]);
  return (
    <div className="OptionsForm">
      <h3>rotate y</h3>
      <Input
        fieldname="comment"
        object={object}
        onChange={(e) => setState(R.set(commentLens, e.target.value))}
      />
      <Input fieldname="angle" object={object} />
      <ObjectForm
        object={object.object}
        setState={setState}
        path={[...path, "object"]}
      />
    </div>
  );
};
