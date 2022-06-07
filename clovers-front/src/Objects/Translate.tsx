import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { TextInput, TripleNumberInput } from "../Input";
import { ObjectForm, SceneObject } from "./SceneObject";

export type Translate = {
  comment?: string;
  object: SceneObject;
  offset: [number, number, number];
};

export const TranslateForm = ({
  object,
  path,
  setState,
}: {
  object: Translate;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>Translate</h3>
      <DeleteButton path={path} setState={setState} />
      <TextInput
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="offset"
        object={object}
        path={path}
        setState={setState}
      />
      <ObjectForm
        object={object.object}
        setState={setState}
        path={[...path, "object"]}
      />
    </div>
  );
};
