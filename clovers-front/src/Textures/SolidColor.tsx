import { ReactElement, useId } from "react";
import { TripleInput } from "../Input";

export type SolidColor = {
  color: [number, number, number];
};
export const SolidColorForm = ({
  texture,
}: {
  texture: SolidColor;
}): ReactElement => {
  const id = useId();
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>SolidColor</option>
      </select>
      <TripleInput fieldname="color" object={texture} />
    </div>
  );
};
