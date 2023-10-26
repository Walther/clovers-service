import { ReactElement, useId } from "react";
import * as R from "ramda";
import "./Input.scss";

export const TextInput = ({
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
  const value: string = object[fieldname] ? object[fieldname] : "";

  return (
    <>
      <label title={tooltip} htmlFor={id}>
        {fieldname}:
      </label>
      <input
        id={id}
        type="text"
        value={value}
        className="Input"
        onChange={(e) => setState(R.set(lensPath, e.target.value))}
      />
    </>
  );
};
