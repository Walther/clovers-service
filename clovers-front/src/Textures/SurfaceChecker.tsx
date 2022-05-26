import { ReactElement, useId } from "react";
import { NumberInput, TripleNumberInput } from "../Input";

export type SurfaceChecker = {
  even: [number, number, number];
  odd: [number, number, number];
  density: number;
};
export const SurfaceCheckerForm = ({
  texture,
  path,
  setState,
}: {
  texture: SurfaceChecker;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const id = useId();
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>SurfaceChecker</option>
      </select>
      <NumberInput
        fieldname="density"
        object={texture}
        path={[...path, "density"]}
        setState={setState}
      />
      <TripleNumberInput fieldname="even" object={texture} />
      <TripleNumberInput fieldname="odd" object={texture} />
    </div>
  );
};
