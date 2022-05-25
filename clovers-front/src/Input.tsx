import { ChangeEventHandler, ReactElement, useId } from "react";
import { SceneObject } from "./Objects/SceneObject";

export const Input = ({
  fieldname,
  object,
  stringify,
  onChange,
}: {
  fieldname: string;
  object: SceneObject;
  stringify?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}): ReactElement => {
  const id = useId();

  // TODO: remove this temporary debug aid
  const value = stringify
    ? JSON.stringify(object[fieldname])
    : object[fieldname];

  return (
    <>
      <label htmlFor={id}>{fieldname}: </label>
      <input id={id} type="text" value={value} onChange={onChange} />
    </>
  );
};

export const TripleInput = ({
  fieldname,
  object,
  onChangeX,
  onChangeY,
  onChangeZ,
}: {
  fieldname: string;
  object: SceneObject;
  onChangeX?: ChangeEventHandler<HTMLInputElement>;
  onChangeY?: ChangeEventHandler<HTMLInputElement>;
  onChangeZ?: ChangeEventHandler<HTMLInputElement>;
}): ReactElement => {
  const id = useId();
  const value = object[fieldname] ? object[fieldname] : [];
  return (
    <>
      <label htmlFor={id + "_x"}>{fieldname}: </label>
      <div className="TripleInput">
        <input
          id={id + "_x"}
          type="text"
          value={value[0]}
          onChange={onChangeX}
        />
        <input
          id={id + "_y"}
          type="text"
          value={value[1]}
          onChange={onChangeY}
        />
        <input
          id={id + "_z"}
          type="text"
          value={value[2]}
          onChange={onChangeZ}
        />
      </div>
    </>
  );
};
