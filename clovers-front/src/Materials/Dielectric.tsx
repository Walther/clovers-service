import { ReactElement, useId } from "react";
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
  const id = useId();
  const mat = "Dielectric";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>{mat}</option>
      </select>
      <NumberInput
        fieldname="refractive_index"
        object={material}
        path={[...path, "refractive_index"]}
        setState={setState}
      />
      <TripleNumberInput fieldname="color" object={material} />
    </div>
  );
};
