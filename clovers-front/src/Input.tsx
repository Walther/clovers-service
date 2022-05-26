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

/** Returns a component with three number input fields. Note that this calls `Number()` for the event.target.value. */
export const TripleNumberInput = ({
  fieldname,
  object,
  tripleOnChange,
}: {
  fieldname: string;
  object: SceneObject;
  tripleOnChange?: { setter: Function; state: object; key: string };
}): ReactElement => {
  const id = useId();
  const value = object[fieldname] ? object[fieldname] : [];
  // TODO: this feels a bit unergonomic. How to make this better?
  let onChangeX, onChangeY, onChangeZ;
  if (tripleOnChange) {
    onChangeX = (e: any) => {
      const newState = replaceTriple(
        tripleOnChange.state,
        tripleOnChange.key,
        Number(e.target.value),
        0
      );
      tripleOnChange.setter(newState);
    };
    onChangeY = (e: any) => {
      const newState = replaceTriple(
        tripleOnChange.state,
        tripleOnChange.key,
        Number(e.target.value),
        1
      );
      tripleOnChange.setter(newState);
    };
    onChangeZ = (e: any) => {
      const newState = replaceTriple(
        tripleOnChange.state,
        tripleOnChange.key,
        Number(e.target.value),
        2
      );
      tripleOnChange.setter(newState);
    };
  }

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

const replaceTriple = (
  original: any,
  key: string,
  value: any,
  index: number
) => {
  switch (index) {
    case 0:
      return {
        ...original,
        [key]: [value, original[key][1], original[key][2]],
      };
    case 1:
      return {
        ...original,
        [key]: [original[key][0], value, original[key][2]],
      };
    case 2:
      return {
        ...original,
        [key]: [original[key][0], original[key][1], value],
      };
    default:
      return {
        original,
      };
  }
};
