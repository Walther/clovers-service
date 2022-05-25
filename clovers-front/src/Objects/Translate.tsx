import { ReactElement } from "react";
import { Input, TripleInput } from "../Input";
import { ObjectForm, SceneObject } from "./SceneObject";

export type Translate = {
  comment?: string;
  object: SceneObject;
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
      <ObjectForm object={object.object} />
    </div>
  );
};
