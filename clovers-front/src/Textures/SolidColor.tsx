import { ReactElement } from "react";
import { TripleInput } from "../Input";

export type SolidColor = {
  color: [number, number, number];
};
export const SolidColorForm = ({
  texture,
}: {
  texture: SolidColor;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <label htmlFor="type">type: </label>
      <select id="type">
        <option>SolidColor</option>
      </select>
      <TripleInput fieldname="color" object={texture} />
    </div>
  );
};
