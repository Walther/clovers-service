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
  path,
  setState,
}: {
  object: MovingSphere;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>moving sphere</h3>
      <Input
        fieldname="comment"
        object={object}
        path={[...path, "comment"]}
        setState={setState}
      />
      <Input
        fieldname="radius"
        object={object}
        path={[...path, "radius"]}
        setState={setState}
      />
      <TripleNumberInput fieldname="center_0" object={object} />
      <TripleNumberInput fieldname="center_1" object={object} />
      <Input
        fieldname="time_0"
        object={object}
        path={[...path, "time_0"]}
        setState={setState}
      />
      <Input
        fieldname="time_1"
        object={object}
        path={[...path, "time_1"]}
        setState={setState}
      />
      <MaterialForm
        material={object.material}
        path={[...path, "material"]}
        setState={setState}
      />
    </div>
  );
};
