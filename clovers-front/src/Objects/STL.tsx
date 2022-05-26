import { ReactElement } from "react";
import { Input, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";

export type STL = {
  comment?: string;
  path: string;
  scale: number;
  center: [number, number, number];
  rotation: [number, number, number];
  material: Material;
};

export const STLForm = ({ object }: { object: STL }): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>stl</h3>
      <Input fieldname="comment" object={object} />
      <Input fieldname="path" object={object} />
      <Input fieldname="scale" object={object} />
      <TripleNumberInput fieldname="center" object={object} />
      <TripleNumberInput fieldname="rotation" object={object} />
      <MaterialForm material={object.material} />
    </div>
  );
};
