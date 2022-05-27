import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { TextInput, NumberInput } from "../Input";
import { ObjectForm } from "./SceneObject";

export type Rotate = {
  comment?: string;
  object: any;
  angle: number;
};

export const RotateYForm = ({
  object,
  path,
  setState,
}: {
  object: Rotate;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  // removing the title from the path for deleting; TODO: remove when adding `kind` to objects and reducing nesting in upstream
  const deletePath = path.slice(0, -1);
  return (
    <div className="OptionsForm">
      <h3>rotate y</h3>
      <DeleteButton path={deletePath} setState={setState} />
      <TextInput
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        fieldname="angle"
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
