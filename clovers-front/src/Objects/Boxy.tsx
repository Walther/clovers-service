import { ReactElement } from "react";
import { Input, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";
import * as R from "ramda";

export type Boxy = {
  comment?: string;
  corner_0: [number, number, number];
  corner_1: [number, number, number];
  material: Material;
};

export const BoxyForm = ({
  object,
  path,
  setState,
}: {
  object: Boxy;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const commentLens = R.lensPath([...path, "comment"]);
  return (
    <div className="OptionsForm">
      <h3>boxy</h3>
      <Input
        fieldname="comment"
        object={object}
        onChange={(e) => setState(R.set(commentLens, e.target.value))}
      />
      <TripleNumberInput fieldname="corner_0" object={object} />
      <TripleNumberInput fieldname="corner_1" object={object} />
      <MaterialForm material={object.material} />
    </div>
  );
};
