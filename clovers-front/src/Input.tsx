import { ReactElement, useId } from "react";
import { SceneObject } from "./Objects/SceneObject";
import * as R from "ramda";
import "./Input.scss";

export const TextInput = ({
  fieldname,
  object,
  path,
  setState,
}: {
  fieldname: string;
  object: SceneObject;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const id = useId();
  const lensPath: any = R.lensPath([...path, fieldname]);
  let value: string = object[fieldname] ? object[fieldname] : "";

  return (
    <>
      <label htmlFor={id}>{fieldname}: </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => setState(R.set(lensPath, e.target.value))}
      />
    </>
  );
};

export const NumberInput = ({
  fieldname,
  object,
  path,
  setState,
}: {
  fieldname: string;
  object: SceneObject;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const id = useId();
  const lensPath: any = R.lensPath([...path, fieldname]);
  let value: any = object[fieldname];

  return (
    <>
      <label htmlFor={id}>{fieldname}: </label>
      <input
        id={id}
        type="text"
        value={value}
        className={isNaN(value) ? "inputError" : ""}
        onChange={(e) => setState(R.set(lensPath, Number(e.target.value)))}
      />
    </>
  );
};

/** Returns a component with three number input fields. Note that this calls `Number()` for the event.target.value. */
export const TripleNumberInput = ({
  fieldname,
  object,
  path,
  setState,
}: {
  fieldname: string;
  object: SceneObject;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const id = useId();
  const value = object[fieldname] ? object[fieldname] : [];
  const lensPathX: any = R.lensPath([...path, fieldname, 0]);
  const lensPathY: any = R.lensPath([...path, fieldname, 1]);
  const lensPathZ: any = R.lensPath([...path, fieldname, 2]);
  const onChangeX = (e: any) => {
    setState(R.set(lensPathX, Number(e.target.value)));
  };
  const onChangeY = (e: any) => {
    setState(R.set(lensPathY, Number(e.target.value)));
  };
  const onChangeZ = (e: any) => {
    setState(R.set(lensPathZ, Number(e.target.value)));
  };

  return (
    <>
      <label htmlFor={id + "_x"}>{fieldname}: </label>
      <div className="TripleInput">
        <input
          id={id + "_x"}
          type="text"
          value={value[0]}
          className={isNaN(value[0]) ? "inputError" : ""}
          onChange={onChangeX}
        />
        <input
          id={id + "_y"}
          type="text"
          value={value[1]}
          className={isNaN(value[1]) ? "inputError" : ""}
          onChange={onChangeY}
        />
        <input
          id={id + "_z"}
          type="text"
          value={value[2]}
          className={isNaN(value[2]) ? "inputError" : ""}
          onChange={onChangeZ}
        />
      </div>
    </>
  );
};
