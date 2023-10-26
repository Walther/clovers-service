import { ReactElement, useId } from "react";
import * as R from "ramda";
import "./Input.scss";

export const NumberInput = ({
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
  const value: any = object[fieldname] ? object[fieldname] : 0;

  return (
    <>
      <label title={tooltip} htmlFor={id}>
        {fieldname}:
      </label>
      <input
        id={id}
        type="text"
        value={value}
        className={isValidNumber(value) ? "Input" : "InputError"}
        onChange={(e) => setState(R.set(lensPath, e.target.value))}
        onBlur={(e) => maybeSetStateNumber(lensPath, setState, e.target.value)}
      />
    </>
  );
};

/** Returns a component with three number input fields. Note that this calls `Number()` for the event.target.value. */
export const TripleNumberInput = ({
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
  const value = object[fieldname] ? object[fieldname] : [];
  const path0 = R.lensPath([...path, fieldname, 0]);
  const path1 = R.lensPath([...path, fieldname, 1]);
  const path2 = R.lensPath([...path, fieldname, 2]);

  return (
    <>
      <label title={tooltip} htmlFor={id + "_x"}>
        {fieldname}:
      </label>
      <div className="TripleInput">
        <input
          id={id + "_x"}
          type="text"
          value={value[0]}
          className={isValidNumber(value[0]) ? "Input" : "InputError"}
          onChange={(e) => setState(R.set(path0, e.target.value))}
          onBlur={(e) => maybeSetStateNumber(path0, setState, e.target.value)}
        />
        <input
          id={id + "_y"}
          type="text"
          value={value[1]}
          className={isValidNumber(value[1]) ? "Input" : "InputError"}
          onChange={(e) => setState(R.set(path1, e.target.value))}
          onBlur={(e) => maybeSetStateNumber(path1, setState, e.target.value)}
        />
        <input
          id={id + "_z"}
          type="text"
          value={value[2]}
          className={isValidNumber(value[2]) ? "Input" : "InputError"}
          onChange={(e) => setState(R.set(path2, e.target.value))}
          onBlur={(e) => maybeSetStateNumber(path2, setState, e.target.value)}
        />
      </div>
    </>
  );
};

export const isValidNumber = (value: string | number) => {
  const parsed = Number(value);
  return typeof parsed == "number" && !isNaN(parsed);
};

export const maybeSetStateNumber = (
  lensPath: any,
  setState: React.Dispatch<React.SetStateAction<any>>,
  value: string | number
) => {
  const parsed = Number(value);
  if (!isNaN(parsed)) {
    setState(R.set(lensPath, parsed));
  }
};
