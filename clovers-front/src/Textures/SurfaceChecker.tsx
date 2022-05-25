import { ReactElement } from "react";
import { Input, TripleInput } from "../Input";

export type SurfaceChecker = {
  even: [number, number, number];
  odd: [number, number, number];
  density: number;
};
export const SurfaceCheckerForm = ({
  texture,
}: {
  texture: SurfaceChecker;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>texture</h3>
      <label htmlFor="type">type: </label>
      <select id="type">
        <option>SurfaceChecker</option>
      </select>
      <Input fieldname="density" object={texture} />
      <TripleInput fieldname="even" object={texture} />
      <TripleInput fieldname="odd" object={texture} />
    </div>
  );
};
