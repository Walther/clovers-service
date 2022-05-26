import { ReactElement } from "react";
import { Input, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";

export type MovingSphere = {
  comment?: string;
  center_0: [number, number, number];
  center_1: [number, number, number];
  time_0: number;
  time_1: number;
  radius: number;
  material: Material;
  aabb: any; // TODO: remove when fixed in upstream
};

export const MovingSphereForm = ({
  object,
}: {
  object: MovingSphere;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>moving sphere</h3>
      <Input fieldname="comment" object={object} />
      <Input fieldname="radius" object={object} />
      <TripleNumberInput fieldname="center_0" object={object} />
      <TripleNumberInput fieldname="center_1" object={object} />
      <Input fieldname="time_0" object={object} />
      <Input fieldname="time_1" object={object} />
      <MaterialForm material={object.material} />
    </div>
  );
};
