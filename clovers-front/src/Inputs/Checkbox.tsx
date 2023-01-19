import { ReactElement, useId } from "react";
import * as R from "ramda";
import "./Input.scss";

export const CheckboxInput = ({
  fieldname,
  object,
  path,
  setState,
}: {
  fieldname: string;
  object: any; // TODO:
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<any>>;
}): ReactElement => {
  const id = useId();
  const lensPath: any = R.lensPath([...path, fieldname]);
  const value: boolean = object[fieldname] ? object[fieldname] : false;

  return (
    <>
      <label htmlFor={id}>{fieldname}: </label>
      <input
        id={id}
        type="checkbox"
        checked={value}
        className="Input"
        onChange={(e) => setState(R.set(lensPath, e.target.checked))}
      />
    </>
  );
};