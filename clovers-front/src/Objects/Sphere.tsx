import { ReactElement } from "react";
import { Input, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";

export type Sphere = {
  comment?: string;
  radius: number;
  center: [number, number, number];
  material: Material;
};

export const SphereForm = ({ object }: { object: Sphere }): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>sphere</h3>
      <Input fieldname="comment" object={object} />
      <Input fieldname="radius" object={object} />
      <TripleNumberInput fieldname="center" object={object} />
      <MaterialForm material={object.material} />
    </div>
  );
};
