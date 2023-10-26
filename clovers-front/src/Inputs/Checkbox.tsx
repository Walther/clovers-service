import { ReactElement, useId } from "react";
import * as R from "ramda";
import "./Input.scss";

export const CheckboxInput = ({
  tooltip,
  fieldname,
  object,
  path,
  setState,
}: {
  tooltip: string;
  fieldname: string;
  object: any;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<any>>;
}): ReactElement => {
  const id = useId();
  const lensPath: any = R.lensPath([...path, fieldname]);
  const value: boolean = object[fieldname] ? object[fieldname] : false;

  return (
    <>
      <label title={tooltip} htmlFor={id}>
        {fieldname}:
      </label>
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
