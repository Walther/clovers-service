import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { TripleNumberInput } from "../Inputs/Number";
import { TextInput } from "../Inputs/Text";
import { CheckboxInput } from "../Inputs/Checkbox";

export type Triangle = {
  kind: "Triangle";
  comment?: string;
  q: [number, number, number];
  u: [number, number, number];
  v: [number, number, number];
  material: string;
  priority: boolean;
};

export const TriangleForm = ({
  object,
  path,
  setState,
}: {
  object: Triangle;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<Triangle>>;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>Triangle</h3>
      <DeleteButton path={path} setState={setState} />
      <TextInput
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
        fieldname="priority"
        object={object}
        path={path}
        setState={setState}
      />
      <TextInput
        fieldname="material"
        object={object}
        path={path}
        setState={setState}
      />
    </div>
  );
};
