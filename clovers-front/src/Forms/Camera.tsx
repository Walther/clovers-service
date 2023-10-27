import { ReactElement } from "react";
import { TripleNumberInput } from "../Inputs/Number";
import { NumberInput } from "../Inputs/Number";
import cornell from "../Examples/cornell.json";

export type CameraOptions = {
  look_from: [number, number, number];
  look_at: [number, number, number];
  up: [number, number, number];
  vertical_fov: number;
  aperture: number;
  focus_distance: number;
};

export const defaultCameraOptions: CameraOptions =
  cornell.camera as CameraOptions;

export const CameraForm = ({
  object,
  path,
  setState,
}: {
  object: CameraOptions;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<CameraOptions>>;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>camera options</h3>

      <TripleNumberInput
        tooltip="camera origin"
        fieldname="look_from"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        tooltip="camera target"
        fieldname="look_at"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        tooltip="camera orientation"
        fieldname="up"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        tooltip="field of view"
        fieldname="vertical_fov"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        tooltip="amount of bokeh blur, 0 is fully clear"
        fieldname="aperture"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        tooltip="focus distance of the camera, needed for non-zero blur"
        fieldname="focus_distance"
        object={object}
        path={path}
        setState={setState}
      />
    </div>
  );
};
