import { ReactElement } from "react";
import { Input, TripleInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";

export type Boxy = {
  comment?: string;
  corner_0: [number, number, number];
  corner_1: [number, number, number];
  material: Material;
};

export const BoxyForm = ({ object }: { object: Boxy }): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>boxy</h3>
      <Input fieldname="comment" object={object} />
      <TripleInput fieldname="corner_0" object={object} />
      <TripleInput fieldname="corner_1" object={object} />
      <MaterialForm material={object.material} />
    </div>
  );
};
