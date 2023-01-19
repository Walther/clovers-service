import { ReactElement, useId } from "react";
import * as R from "ramda";
import "./Input.scss";

export const TextInput = ({
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
  const value: string = object[fieldname] ? object[fieldname] : "";

  return (
    <>
      <label htmlFor={id}>{fieldname}: </label>
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
