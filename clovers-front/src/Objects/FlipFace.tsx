import { ReactElement } from "react";
import { Input } from "../Input";
import * as R from "ramda";

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
  const commentLens = R.lensPath([...path, "comment"]);
  return (
    <div className="OptionsForm">
      <h3>flip face</h3>
      <Input
        fieldname="comment"
        object={object}
        onChange={(e) => setState(R.set(commentLens, e.target.value))}
      />
      <Input fieldname="object" object={object} stringify={true} />
    </div>
  );
};
