import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { CheckboxInput, TextInput, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";

export type Quad = {
  comment?: string;
  q: [number, number, number];
  u: [number, number, number];
  v: [number, number, number];
  material: Material;
};

export const QuadForm = ({
  object,
  path,
  setState,
}: {
  object: Quad;
  path: R.Path;
  setState: any;
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
