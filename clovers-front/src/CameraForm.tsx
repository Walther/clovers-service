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
  object,
  path,
  setState,
}: {
  object: CameraOptions;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>camera</h3>

      <TripleNumberInput
        fieldname="look_from"
        object={object}
        tripleOnChange={{
          setter: setState,
          state: object,
          key: "look_from",
        }}
      />
      <TripleNumberInput
        fieldname="look_at"
        object={object}
        tripleOnChange={{
          setter: setState,
          state: object,
          key: "look_at",
        }}
      />
      <TripleNumberInput
        fieldname="up"
        object={object}
        tripleOnChange={{
          setter: setState,
          state: object,
          key: "up",
        }}
      />
      <Input
        fieldname="vertical_fov"
        object={object}
        path={[...path, "vertical_fov"]}
        setState={setState}
      />
      <Input
        fieldname="aperture"
        object={object}
        path={[...path, "aperture"]}
        setState={setState}
      />
      <Input
        fieldname="focus_distance"
        object={object}
        path={[...path, "focus_distance"]}
        setState={setState}
      />
      <Button
        handleClick={() => setState(defaultCameraOptions)}
        text={"defaults"}
      />
    </div>
  );
};
