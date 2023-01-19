import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { NumberInput, TripleNumberInput } from "../Inputs/NumberInput";
import { TextInput } from "../Inputs/TextInput";
import { CheckboxInput } from "../Inputs/CheckboxInput";
import { Material, MaterialForm } from "../Materials/Material";

export type Sphere = {
  kind: "Sphere";
  comment?: string;
  radius: number;
  center: [number, number, number];
  material: Material;
  priority: boolean;
};

export const SphereForm = ({
  object,
  path,
  setState,
}: {
  object: Sphere;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<Sphere>>;
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
