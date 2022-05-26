import { ReactElement, useId } from "react";
import { TripleNumberInput } from "../Input";

export type SolidColor = {
  color: [number, number, number];
};
export const SolidColorForm = ({
  texture,
  path,
  setState,
}: {
  texture: SolidColor;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const id = useId();
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>SolidColor</option>
      </select>
      <TripleNumberInput
        fieldname="color"
        object={texture}
        path={path}
        setState={setState}
      />
    </div>
  );
};
