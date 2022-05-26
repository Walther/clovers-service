import { ReactElement } from "react";
import { Input, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";
import * as R from "ramda";

export type Triangle = {
  comment?: string;
  q: [number, number, number];
  u: [number, number, number];
  v: [number, number, number];
  material: Material;
};

export const TriangleForm = ({
  object,
  index,
  setState,
}: {
  object: Triangle;
  index: number;
  setState: Function;
}): ReactElement => {
  const commentLens = R.lensPath([index, "Triangle", "comment"]);
  return (
    <div className="OptionsForm">
      <h3>triangle</h3>
      <Input
        fieldname="comment"
        object={object}
        onChange={(e) => setState(R.set(commentLens, e.target.value))}
      />
      <TripleNumberInput fieldname="q" object={object} />
      <TripleNumberInput fieldname="u" object={object} />
      <TripleNumberInput fieldname="v" object={object} />
      <MaterialForm material={object.material} />
    </div>
  );
};
