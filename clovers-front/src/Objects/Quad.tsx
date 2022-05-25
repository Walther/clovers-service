import { ReactElement } from "react";
import { Input, TripleInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";

export type Quad = {
  comment?: string;
  q: [number, number, number];
  u: [number, number, number];
  v: [number, number, number];
  material: Material;
};

export const QuadForm = ({ object }: { object: Quad }): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>quad</h3>
      <Input fieldname="comment" object={object} />
      <TripleInput fieldname="q" object={object} />
      <TripleInput fieldname="u" object={object} />
      <TripleInput fieldname="v" object={object} />
      <MaterialForm material={object.material} />
    </div>
  );
};
