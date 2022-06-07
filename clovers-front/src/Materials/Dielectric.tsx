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
  return (
    <div className="OptionsForm">
      <h3>{mat}</h3>
      <DeleteButton path={path} setState={setState} />
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
