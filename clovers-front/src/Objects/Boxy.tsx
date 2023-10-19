import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { TripleNumberInput } from "../Inputs/Number";
import { TextInput } from "../Inputs/Text";
import { CheckboxInput } from "../Inputs/Checkbox";

export type Boxy = {
  kind: "Boxy";
  comment?: string;
  corner_0: [number, number, number];
  corner_1: [number, number, number];
  material: string;
  priority: boolean;
};

export const BoxyForm = ({
  object,
  path,
  setState,
}: {
  object: Boxy;
  path: R.Path;
  setState: any;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>Boxy</h3>
      <DeleteButton path={path} setState={setState} />
      <TextInput
        tooltip="descriptive comment or name of the object"
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        tooltip="corner coordinate"
        fieldname="corner_0"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        tooltip="diagonally opposite corner coordinate"
        fieldname="corner_1"
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
