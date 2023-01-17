import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import {
  TextInput,
  NumberInput,
  TripleNumberInput,
  CheckboxInput,
} from "../Input";
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
  path: R.Path;
  setState: any;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>Sphere</h3>
      <DeleteButton path={path} setState={setState} />
      <TextInput
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        fieldname="radius"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="center"
        object={object}
        path={path}
        setState={setState}
      />
      <CheckboxInput
        fieldname="priority"
        object={object}
        path={path}
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
