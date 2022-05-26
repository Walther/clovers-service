import { ReactElement } from "react";
import { Input, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";
import * as R from "ramda";

export type Sphere = {
  comment?: string;
  radius: number;
  center: [number, number, number];
  material: Material;
};

export const SphereForm = ({
  object,
  index,
  setState,
}: {
  object: Sphere;
  index: number;
  setState: Function;
}): ReactElement => {
  const commentLens = R.lensPath([index, "Sphere", "comment"]);
  return (
    <div className="OptionsForm">
      <h3>sphere</h3>
      <Input
        fieldname="comment"
        object={object}
        onChange={(e) => setState(R.set(commentLens, e.target.value))}
      />
      <Input fieldname="radius" object={object} />
      <TripleNumberInput fieldname="center" object={object} />
      <MaterialForm material={object.material} />
    </div>
  );
};
