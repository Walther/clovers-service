import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { NumberInput } from "../Inputs/Number";
import { TextInput } from "../Inputs/Text";

export type Dispersive = {
  kind: "Dispersive";
  cauchy_a: number;
  cauchy_b: number;
  name: string;
};

export const DispersiveForm = ({
  material,
  path,
  setState,
}: {
  material: Dispersive;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<Dispersive>>;
}): ReactElement => {
  const kind = "Dispersive";
  return (
    <div className="OptionsForm">
      <h3>{material.name || kind}</h3>
      <TextInput
        tooltip="unique name of the material"
        fieldname="name"
        object={material}
        path={path}
        setState={setState}
      />
      <DeleteButton path={path} setState={setState} />
      <NumberInput
        tooltip="cauchy equation constant A"
        fieldname="cauchy_a"
        object={material}
        path={path}
        setState={setState}
      />
      <NumberInput
        tooltip="cauchy equation constant B"
        fieldname="cauchy_b"
        object={material}
        path={path}
        setState={setState}
      />
    </div>
  );
};
