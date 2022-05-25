import { ReactElement } from "react";
import { Input, TripleInput } from "../Input";
import { Material } from "../Material";

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
      <TripleInput fieldname="center" object={object} />
      <Input fieldname="material" object={object} stringify={true} />
    </div>
  );
};
