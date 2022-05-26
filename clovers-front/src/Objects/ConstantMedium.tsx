import { ReactElement } from "react";
import { Input } from "../Input";
import * as R from "ramda";

export type ConstantMedium = {
  comment?: string;
  density: number;
  boundary: any;
  texture: any;
};

export const ConstantMediumForm = ({
  object,
  index,
  setState,
}: {
  object: ConstantMedium;
  index: number;
  setState: Function;
}): ReactElement => {
  const commentLens = R.lensPath([index, "ConstantMedium", "comment"]);
  return (
    <div className="OptionsForm">
      <h3>constant medium</h3>
      <Input
        fieldname="comment"
        object={object}
        onChange={(e) => setState(R.set(commentLens, e.target.value))}
      />
      <Input fieldname="density" object={object} />
      <Input fieldname="boundary" object={object} stringify={true} />
      <Input fieldname="texture" object={object} stringify={true} />
    </div>
  );
};
