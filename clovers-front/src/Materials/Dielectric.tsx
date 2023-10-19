import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { TripleNumberInput, NumberInput } from "../Inputs/Number";
import { TextInput } from "../Inputs/Text";

export type Dielectric = {
  kind: "Dielectric";
  color: [number, number, number];
  refractive_index: number;
  name: string;
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
  const kind = "Dielectric";
  return (
    <div className="OptionsForm">
      <h3>{material.name || kind}</h3>
      <TextInput
        fieldname="name"
        object={material}
        path={path}
        setState={setState}
      />
      <DeleteButton path={path} setState={setState} />
      <NumberInput
        tooltip="refractive index of the material"
        fieldname="refractive_index"
        object={material}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        tooltip="sRGB float"
        fieldname="color"
        object={material}
        path={path}
        setState={setState}
      />
    </div>
  );
};
