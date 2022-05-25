import { ReactElement } from "react";
import { Input, TripleInput } from "../Input";

export type Translate = {
  comment?: string;
  object: any;
  offset: [number, number, number];
};

export const TranslateForm = ({
  object,
}: {
  object: Translate;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>translate</h3>
      <Input fieldname="comment" object={object} />
      <TripleInput fieldname="offset" object={object} />
      <Input fieldname="object" object={object} stringify={true} />
    </div>
  );
};
