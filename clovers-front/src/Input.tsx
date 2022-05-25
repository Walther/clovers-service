import { ReactElement } from "react";
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
  // TODO: remove this temporary debug aid
  const value = stringify
    ? JSON.stringify(object[fieldname])
    : object[fieldname];

  return (
    <>
      <label htmlFor="{fieldname}">{fieldname}: </label>
      <input id="{fieldname}" type="text" value={value} />
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
  return (
    <>
      <label htmlFor="{fieldname}">{fieldname}: </label>
      <div className="TripleInput">
        <input id={`${fieldname}_x`} type="text" value={object[fieldname][0]} />
        <input id={`${fieldname}_y`} type="text" value={object[fieldname][1]} />
        <input id={`${fieldname}_z`} type="text" value={object[fieldname][2]} />
      </div>
    </>
  );
};
