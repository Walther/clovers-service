import { ReactElement, useId } from "react";
import { SceneObject } from "./Objects/SceneObject";

export const Input = ({
  fieldname,
  object,
  stringify,
}: {
  fieldname: string;
  object: SceneObject;
  stringify?: boolean;
}): ReactElement => {
  const id = useId();

  // TODO: remove this temporary debug aid
  const value = stringify
    ? JSON.stringify(object[fieldname])
    : object[fieldname];

  return (
    <>
      <label htmlFor={id}>{fieldname}: </label>
      <input id={id} type="text" value={value} />
    </>
  );
};

export const TripleInput = ({
  fieldname,
  object,
}: {
  fieldname: string;
  object: SceneObject;
}): ReactElement => {
  const id = useId();
  const value = object[fieldname] ? object[fieldname] : [];
  return (
    <>
      <label htmlFor={id}>{fieldname}: </label>
      <div className="TripleInput">
        <input id={id} type="text" value={value[0]} />
        <input id={id + "_y"} type="text" value={value[1]} />
        <input id={id + "_z"} type="text" value={value[2]} />
      </div>
    </>
  );
};
