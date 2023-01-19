import { ReactElement } from "react";
import "./Input.scss";

export const FileInput = ({ id }: { id: any }): ReactElement => {
  return <input id={id} type="file" className="Input" />;
};
