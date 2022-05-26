import { ReactElement } from "react";
import { Input, TripleNumberInput } from "../Input";
import { ObjectForm, SceneObject } from "./SceneObject";
import * as R from "ramda";

export type Translate = {
  comment?: string;
  object: SceneObject;
  offset: [number, number, number];
};

export const TranslateForm = ({
  object,
  index,
  setState,
}: {
  object: Translate;
  index: number;
  setState: Function;
}): ReactElement => {
  const commentLens = R.lensPath([index, "Translate", "comment"]);
  return (
    <div className="OptionsForm">
      <h3>translate</h3>
      <Input
        fieldname="comment"
        object={object}
        onChange={(e) => setState(R.set(commentLens, e.target.value))}
      />
      <TripleNumberInput fieldname="offset" object={object} />
      {/* <ObjectForm object={object.object} /> */}
    </div>
  );
};
