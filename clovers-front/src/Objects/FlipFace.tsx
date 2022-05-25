import { ReactElement } from "react";
import { Input } from "../Input";

export type FlipFace = {
  comment?: string;
  object: any;
};

export const FlipFaceForm = ({
  object,
}: {
  object: FlipFace;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>flip face</h3>
      <Input fieldname="comment" object={object} />
      <Input fieldname="object" object={object} stringify={true} />
    </div>
  );
};
