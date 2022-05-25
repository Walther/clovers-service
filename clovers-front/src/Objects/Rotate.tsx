import { ReactElement } from "react";
import { Input } from "../Input";

export type Rotate = {
  comment?: string;
  object: any;
  angle: number;
};

export const RotateForm = ({ object }: { object: Rotate }): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>rotate</h3>
      <Input fieldname="comment" object={object} />
      <Input fieldname="angle" object={object} />
      <Input fieldname="object" object={object} stringify={true} />
    </div>
  );
};
