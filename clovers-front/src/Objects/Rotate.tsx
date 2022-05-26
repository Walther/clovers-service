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
  index,
  setState,
}: {
  object: Rotate;
  index: number;
  setState: Function;
}): ReactElement => {
  const commentLens = R.lensPath([index, "RotateY", "comment"]);
  return (
    <div className="OptionsForm">
      <h3>rotate y</h3>
      <Input
        fieldname="comment"
        object={object}
        onChange={(e) => setState(R.set(commentLens, e.target.value))}
      />
      <Input fieldname="angle" object={object} />
      {/* <ObjectForm object={object.object} /> */}
    </div>
  );
};
