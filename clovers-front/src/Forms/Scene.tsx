import { ReactElement } from "react";
import { TripleNumberInput } from "../Inputs/Number";
import { NumberInput } from "../Inputs/Number";
import cornell from "../Examples/cornell.json";

export type SceneOptions = {
  time_0: number;
  time_1: number;
  background_color: [number, number, number];
};

export const defaultSceneOptions: SceneOptions = {
  time_0: cornell.time_0,
  time_1: cornell.time_1,
  background_color: cornell.background_color,
} as SceneOptions;

export const SceneOptionsForm = ({
  object,
  path,
  setState,
}: {
  object: SceneOptions;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<SceneOptions>>;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>scene options</h3>

      <TripleNumberInput
        tooltip="rgb float"
        fieldname="background_color"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        tooltip="start time of the shutter"
        fieldname="time_0"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        tooltip="end time of the shutter"
        fieldname="time_1"
        object={object}
        path={path}
        setState={setState}
      />
    </div>
  );
};
