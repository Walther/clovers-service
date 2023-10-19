import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { TripleNumberInput } from "../Inputs/Number";
import { TextInput } from "../Inputs/Text";
import { CheckboxInput } from "../Inputs/Checkbox";
import { ObjectForm, SceneObject } from "./SceneObject";

export type Translate = {
  kind: "Translate";
  comment?: string;
  object: SceneObject;
  offset: [number, number, number];
  priority: boolean;
};

export const TranslateForm = ({
  object,
  path,
  setState,
}: {
  object: Translate;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<Translate>>;
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
        tooltip="offset vector"
        fieldname="offset"
        object={object}
        path={path}
        setState={setState}
      />
      <CheckboxInput
        tooltip="prioritize object in multiple importance sampling"
        fieldname="priority"
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
