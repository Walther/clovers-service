import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { NumberInput, TripleNumberInput } from "../Input";

export type Dielectric = {
  color: [number, number, number];
  refractive_index: number;
};

export const DielectricForm = ({
  material,
  path,
  setState,
}: {
  material: Dielectric;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const mat = "Dielectric";
  // removing the title from the path for deleting; TODO: remove when adding `kind` to objects and reducing nesting in upstream
  const deletePath = path.slice(0, -1);
  return (
    <div className="OptionsForm">
      <h3>{mat}</h3>
      <DeleteButton path={deletePath} setState={setState} />
      <NumberInput
        fieldname="refractive_index"
        object={material}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="color"
        object={material}
        path={path}
        setState={setState}
      />
    </div>
  );
};
