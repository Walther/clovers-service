import { ReactElement } from "react";
import { Input, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";

export type Sphere = {
  comment?: string;
  radius: number;
  center: [number, number, number];
  material: Material;
};

export const SphereForm = ({
  object,
  path,
  setState,
}: {
  object: Sphere;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>sphere</h3>
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
      <TripleNumberInput fieldname="center" object={object} />
      <MaterialForm
        material={object.material}
        path={[...path, "material"]}
        setState={setState}
      />
    </div>
  );
};
