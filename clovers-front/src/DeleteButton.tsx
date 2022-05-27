import * as R from "ramda";
import { ReactElement } from "react";
import { Button } from "./Button";
import "./DeleteButton.scss";

export const DeleteButton = ({
  object,
  path,
  setState,
}: {
  object: any;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const lensPath: any = R.lensPath(path);

  return (
    <Button
      className={"DeleteButton"}
      handleClick={() =>
        setState((prevState: any) => {
          // TODO: how to do a proper delete with ramda?
          let newstate: Object = R.set(lensPath, {}, prevState);
          return newstate;
        })
      }
      text="🗑️"
    />
  );
};
