import { ReactElement, useId } from "react";
import { NumberInput, TripleNumberInput } from "../Input";

export type SpatialChecker = {
  even: [number, number, number];
  odd: [number, number, number];
  density: number;
};

export const SpatialCheckerForm = ({
  texture,
  path,
  setState,
}: {
  texture: SpatialChecker;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const id = useId();
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>SpatialChecker</option>
      </select>
      <NumberInput
        fieldname="density"
        object={texture}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="even"
        object={texture}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="odd"
        object={texture}
        path={path}
        setState={setState}
      />
    </div>
  );
};
