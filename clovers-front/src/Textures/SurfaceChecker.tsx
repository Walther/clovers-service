import { ReactElement, useId } from "react";
import { DeleteButton } from "../DeleteButton";
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
  // removing the title from the path for deleting; TODO: remove when adding `kind` to objects and reducing nesting in upstream
  const deletePath = path.slice(0, -1);
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <DeleteButton path={deletePath} setState={setState} />
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>SurfaceChecker</option>
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
