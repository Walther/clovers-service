import { ReactElement } from "react";
import { Input, TripleNumberInput } from "../Input";
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
      <TripleNumberInput fieldname="corner_0" object={object} />
      <TripleNumberInput fieldname="corner_1" object={object} />
      <MaterialForm material={object.material} />
    </div>
  );
};
