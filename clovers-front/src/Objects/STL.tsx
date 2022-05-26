import { ReactElement } from "react";
import { Input, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";
import * as R from "ramda";

export type STL = {
  comment?: string;
  path: string;
  scale: number;
  center: [number, number, number];
  rotation: [number, number, number];
  material: Material;
};

export const STLForm = ({
  object,
  index,
  setState,
}: {
  object: STL;
  index: number;
  setState: Function;
}): ReactElement => {
  const commentLens = R.lensPath([index, "STL", "comment"]);
  return (
    <div className="OptionsForm">
      <h3>stl</h3>
      <Input
        fieldname="comment"
        object={object}
        onChange={(e) => setState(R.set(commentLens, e.target.value))}
      />
      <Input fieldname="path" object={object} />
      <Input fieldname="scale" object={object} />
      <TripleNumberInput fieldname="center" object={object} />
      <TripleNumberInput fieldname="rotation" object={object} />
      <MaterialForm material={object.material} />
    </div>
  );
};
