import { ReactElement } from "react";
import { TextInput, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";

export type Triangle = {
  comment?: string;
  q: [number, number, number];
  u: [number, number, number];
  v: [number, number, number];
  material: Material;
};

export const TriangleForm = ({
  object,
  path,
  setState,
}: {
  object: Triangle;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>triangle</h3>
      <TextInput
        fieldname="comment"
        object={object}
        path={[...path, "comment"]}
        setState={setState}
      />
      <TripleNumberInput fieldname="q" object={object} />
      <TripleNumberInput fieldname="u" object={object} />
      <TripleNumberInput fieldname="v" object={object} />
      <MaterialForm
        material={object.material}
        path={[...path, "material"]}
        setState={setState}
      />
    </div>
  );
};
