import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { TripleNumberInput } from "../Inputs/NumberInput";
import { TextInput } from "../Inputs/TextInput";
import { CheckboxInput } from "../Inputs/CheckboxInput";
import { Material, MaterialForm } from "../Materials/Material";

export type Quad = {
  kind: "Quad";
  comment?: string;
  q: [number, number, number];
  u: [number, number, number];
  v: [number, number, number];
  material: Material;
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
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="q"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="u"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
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
      <MaterialForm
        material={object.material}
        path={[...path, "material"]}
        setState={setState}
      />
    </div>
  );
};
