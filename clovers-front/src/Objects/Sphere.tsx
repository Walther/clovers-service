import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { NumberInput, TripleNumberInput } from "../Inputs/Number";
import { TextInput } from "../Inputs/Text";
import { CheckboxInput } from "../Inputs/Checkbox";

export type Sphere = {
  kind: "Sphere";
  comment?: string;
  radius: number;
  center: [number, number, number];
  material: string;
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
        tooltip="descriptive comment or name of the object"
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        tooltip="radius of the sphere"
        fieldname="radius"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        tooltip="center coordinate"
        fieldname="center"
        object={object}
        path={path}
        setState={setState}
      />
      <CheckboxInput
        tooltip="prioritize object in multiple importance sampling"
        fieldname="priority"
        object={object}
        path={path}
        setState={setState}
      />
      <TextInput
        tooltip="unique name (pointer) of the material for this object"
        fieldname="material"
        object={object}
        path={path}
        setState={setState}
      />
    </div>
  );
};
