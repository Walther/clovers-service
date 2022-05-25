import { ReactElement, useId } from "react";
import { Input, TripleInput } from "../Input";

export type Dielectric = {
  color: [number, number, number];
  refractive_index: number;
};

export const DielectricForm = ({
  material,
}: {
  material: Dielectric;
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
      <Input fieldname="refractive_index" object={material} />
      <TripleInput fieldname="color" object={material} />
    </div>
  );
};
