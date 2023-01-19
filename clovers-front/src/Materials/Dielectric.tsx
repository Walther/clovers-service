import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { TripleNumberInput, NumberInput } from "../Inputs/Number";

export type Dielectric = {
  kind: "Dielectric";
  color: [number, number, number];
  refractive_index: number;
};

export const DielectricForm = ({
  material,
  path,
  setState,
}: {
  material: Dielectric;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<Dielectric>>;
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
