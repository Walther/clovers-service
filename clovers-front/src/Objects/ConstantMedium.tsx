import { ReactElement } from "react";
import { Input } from "../Input";

export type ConstantMedium = {
  comment?: string;
  density: number;
  boundary: any;
  texture: any;
};

export const ConstantMediumForm = ({
  object,
}: {
  object: ConstantMedium;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>constant medium</h3>
      <Input fieldname="comment" object={object} />
      <Input fieldname="density" object={object} />
      <Input fieldname="boundary" object={object} stringify={true} />
      <Input fieldname="texture" object={object} stringify={true} />
    </div>
  );
};
