import { ReactElement } from "react";
import { Input } from "../Input";
import { ObjectForm } from "./SceneObject";

export type Rotate = {
  comment?: string;
  object: any;
  angle: number;
};

export const RotateYForm = ({ object }: { object: Rotate }): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>rotate y</h3>
      <Input fieldname="comment" object={object} />
      <Input fieldname="angle" object={object} />
      <ObjectForm object={object.object} />
    </div>
  );
};
