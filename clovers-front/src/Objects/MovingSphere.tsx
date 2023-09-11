import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { NumberInput, TripleNumberInput } from "../Inputs/Number";
import { TextInput } from "../Inputs/Text";
import { CheckboxInput } from "../Inputs/Checkbox";

export type MovingSphere = {
  kind: "MovingSphere";
  comment?: string;
  center_0: [number, number, number];
  center_1: [number, number, number];
  time_0: number;
  time_1: number;
  radius: number;
  material: string;
  aabb: any; // TODO: remove when fixed in upstream
  priority: boolean;
};

export const MovingSphereForm = ({
  object,
  path,
  setState,
}: {
  object: MovingSphere;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<MovingSphere>>;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>MovingSphere</h3>
      <DeleteButton path={path} setState={setState} />
      <TextInput
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        fieldname="radius"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="center_0"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="center_1"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        fieldname="time_0"
        object={object}
        path={[...path, "time_0"]}
        setState={setState}
      />
      <NumberInput
        fieldname="time_1"
        object={object}
        path={[...path, "time_1"]}
        setState={setState}
      />
      <CheckboxInput
        fieldname="priority"
        object={object}
        path={path}
        setState={setState}
      />
      <TextInput
        fieldname="material"
        object={object}
        path={path}
        setState={setState}
      />
    </div>
  );
};
