import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { TripleNumberInput } from "../Inputs/Number";
import { TextInput } from "../Inputs/Text";
import { CheckboxInput } from "../Inputs/Checkbox";

export type Quad = {
  kind: "Quad";
  comment?: string;
  q: [number, number, number];
  u: [number, number, number];
  v: [number, number, number];
  material: string;
  priority: boolean;
};

export const QuadForm = ({
  object,
  path,
  setState,
}: {
  object: Quad;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<Quad>>;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>Quad</h3>
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
        fieldname="q"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        tooltip="side vector u"
        fieldname="u"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        tooltip="side vector v"
        fieldname="v"
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
