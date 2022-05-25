import { ReactElement } from "react";
import { Button } from "./Button";
import { Input, TripleInput } from "./Input";

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

const replaceTriple = (
  original: any,
  key: string,
  value: any,
  index: number
) => {
  switch (index) {
    case 0:
      return {
        ...original,
        [key]: [value, original[key][1], original[key][2]],
      };
    case 1:
      return {
        ...original,
        [key]: [original[key][0], value, original[key][2]],
      };
    case 2:
      return {
        ...original,
        [key]: [original[key][0], original[key][1], value],
      };
    default:
      return {
        original,
      };
  }
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

      <TripleInput
        fieldname="look_from"
        object={cameraOptions}
        onChangeX={(e) =>
          setCameraOptions(
            replaceTriple(cameraOptions, "look_from", Number(e.target.value), 0)
          )
        }
        onChangeY={(e) =>
          setCameraOptions(
            replaceTriple(cameraOptions, "look_from", Number(e.target.value), 1)
          )
        }
        onChangeZ={(e) =>
          setCameraOptions(
            replaceTriple(cameraOptions, "look_from", Number(e.target.value), 2)
          )
        }
      />
      <TripleInput
        fieldname="look_at"
        object={cameraOptions}
        onChangeX={(e) =>
          setCameraOptions(
            replaceTriple(cameraOptions, "look_at", Number(e.target.value), 0)
          )
        }
        onChangeY={(e) =>
          setCameraOptions(
            replaceTriple(cameraOptions, "look_at", Number(e.target.value), 1)
          )
        }
        onChangeZ={(e) =>
          setCameraOptions(
            replaceTriple(cameraOptions, "look_at", Number(e.target.value), 2)
          )
        }
      />
      <TripleInput
        fieldname="up"
        object={cameraOptions}
        onChangeX={(e) =>
          setCameraOptions(
            replaceTriple(cameraOptions, "up", Number(e.target.value), 0)
          )
        }
        onChangeY={(e) =>
          setCameraOptions(
            replaceTriple(cameraOptions, "up", Number(e.target.value), 1)
          )
        }
        onChangeZ={(e) =>
          setCameraOptions(
            replaceTriple(cameraOptions, "up", Number(e.target.value), 2)
          )
        }
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
