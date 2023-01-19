import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { TripleNumberInput } from "../Inputs/NumberInput";
import { TextInput } from "../Inputs/TextInput";
import { CheckboxInput } from "../Inputs/CheckboxInput";
import { Material, MaterialForm } from "../Materials/Material";

export type Boxy = {
  kind: "Boxy";
  comment?: string;
  corner_0: [number, number, number];
  corner_1: [number, number, number];
  material: Material;
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
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="corner_0"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="corner_1"
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
