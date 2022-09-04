import * as R from "ramda";
import { ReactElement } from "react";
import { Button } from "./Button";
import "./DeleteButton.scss";

export const DeleteButton = ({
  path,
  setState,
}: {
  path: any; // TODO: ramda path type
  setState: any;
}): ReactElement => {
  return (
    <Button
      className={"DeleteButton"}
      handleClick={() =>
        setState((prevState: any) => {
          return R.dissocPath(path, prevState);
        })
      }
      text="🗑️"
    />
  );
};
