import { ReactElement } from "react";
import { Button } from "./Button";
import { Input, TripleNumberInput } from "./Input";

export type CameraOptions = {
  look_from: [number, number, number];
  look_at: [number, number, number];
  up: [number, number, number];
  vertical_fov: number;
  aperture: number;
  focus_distance: number;
};

export const defaultCameraOptions: CameraOptions = {
  look_from: [278.0, 278.0, -800.0],
  look_at: [278.0, 278.0, 0.0],
  up: [0.0, 1.0, 0.0],
  vertical_fov: 40.0,
  aperture: 0.0,
  focus_distance: 10.0,
};

export const CameraForm = ({
  cameraOptions,
  setCameraOptions,
}: {
  cameraOptions: CameraOptions;
  setCameraOptions: Function;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>camera</h3>

      <TripleNumberInput
        fieldname="look_from"
        object={cameraOptions}
        tripleOnChange={{
          setter: setCameraOptions,
          state: cameraOptions,
          key: "look_from",
        }}
      />
      <TripleNumberInput
        fieldname="look_at"
        object={cameraOptions}
        tripleOnChange={{
          setter: setCameraOptions,
          state: cameraOptions,
          key: "look_at",
        }}
      />
      <TripleNumberInput
        fieldname="up"
        object={cameraOptions}
        tripleOnChange={{
          setter: setCameraOptions,
          state: cameraOptions,
          key: "up",
        }}
      />
      <Input
        fieldname="vertical_fov"
        object={cameraOptions}
        onChange={(e) =>
          setCameraOptions({
            ...cameraOptions,
            vertical_fov: Number(e.target.value),
          })
        }
      />
      <Input
        fieldname="aperture"
        object={cameraOptions}
        onChange={(e) =>
          setCameraOptions({
            ...cameraOptions,
            aperture: Number(e.target.value),
          })
        }
      />
      <Input
        fieldname="focus_distance"
        object={cameraOptions}
        onChange={(e) =>
          setCameraOptions({
            ...cameraOptions,
            focus_distance: Number(e.target.value),
          })
        }
      />
      <Button
        handleClick={() => setCameraOptions(defaultCameraOptions)}
        text={"defaults"}
      />
    </div>
  );
};
