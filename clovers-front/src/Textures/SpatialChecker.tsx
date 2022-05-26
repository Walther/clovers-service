import { ReactElement, useId } from "react";
import { Input, TripleNumberInput } from "../Input";

export type SpatialChecker = {
  even: [number, number, number];
  odd: [number, number, number];
  density: number;
};

export const SpatialCheckerForm = ({
  texture,
}: {
  texture: SpatialChecker;
}): ReactElement => {
  const id = useId();
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>SpatialChecker</option>
      </select>
      <Input fieldname="density" object={texture} />
      {/* <TripleNumberInput fieldname="even" object={texture} />
      <TripleNumberInput fieldname="odd" object={texture} /> */}
    </div>
  );
};
