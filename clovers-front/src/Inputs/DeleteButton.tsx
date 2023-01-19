import * as R from "ramda";
import { ReactElement } from "react";
import { Button } from "./Button";
import "./DeleteButton.scss";

export const DeleteButton = ({
  path,
  setState,
}: {
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<any>>;
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
