import { ReactElement, useId } from "react";
import { DeleteButton } from "../DeleteButton";
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
  // removing the title from the path for deleting; TODO: remove when adding `kind` to objects and reducing nesting in upstream
  const deletePath = path.slice(0, -1);
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <DeleteButton path={deletePath} setState={setState} />
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
