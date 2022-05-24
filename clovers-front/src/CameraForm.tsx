import { ReactElement } from "react";
import { Button } from "./Button";

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
      <h2>camera options</h2>

      {/* TODO: this is an ergonomic nightmare, but it'll get the job done for now */}

      <label htmlFor="look_from">look_from: </label>
      <div className="TripleInput">
        <input
          id="look_from_x"
          type="text"
          value={cameraOptions.look_from[0]}
          onChange={(e) =>
            setCameraOptions({
              ...cameraOptions,
              look_from: [
                Number(e.target.value),
                cameraOptions.look_from[1],
                cameraOptions.look_from[2],
              ],
            })
          }
        />
        <input
          id="look_from_y"
          type="text"
          value={cameraOptions.look_from[1]}
          onChange={(e) =>
            setCameraOptions({
              ...cameraOptions,
              look_from: [
                cameraOptions.look_from[0],
                Number(e.target.value),
                cameraOptions.look_from[2],
              ],
            })
          }
        />
        <input
          id="look_from_z"
          type="text"
          value={cameraOptions.look_from[2]}
          onChange={(e) =>
            setCameraOptions({
              ...cameraOptions,
              look_from: [
                cameraOptions.look_from[0],
                cameraOptions.look_from[1],
                Number(e.target.value),
              ],
            })
          }
        />
      </div>

      <label htmlFor="look_at">look_at: </label>
      <div className="TripleInput">
        <input
          id="look_at_x"
          type="text"
          value={cameraOptions.look_at[0]}
          onChange={(e) =>
            setCameraOptions({
              ...cameraOptions,
              look_at: [
                Number(e.target.value),
                cameraOptions.look_at[1],
                cameraOptions.look_at[2],
              ],
            })
          }
        />
        <input
          id="look_at_y"
          type="text"
          value={cameraOptions.look_at[1]}
          onChange={(e) =>
            setCameraOptions({
              ...cameraOptions,
              look_at: [
                cameraOptions.look_at[0],
                Number(e.target.value),
                cameraOptions.look_at[2],
              ],
            })
          }
        />
        <input
          id="look_at_z"
          type="text"
          value={cameraOptions.look_at[2]}
          onChange={(e) =>
            setCameraOptions({
              ...cameraOptions,
              look_at: [
                cameraOptions.look_at[0],
                cameraOptions.look_at[1],
                Number(e.target.value),
              ],
            })
          }
        />
      </div>

      <label htmlFor="up">up: </label>
      <div className="TripleInput">
        <input
          id="up_x"
          type="text"
          value={cameraOptions.up[0]}
          onChange={(e) =>
            setCameraOptions({
              ...cameraOptions,
              up: [
                Number(e.target.value),
                cameraOptions.up[1],
                cameraOptions.up[2],
              ],
            })
          }
        />
        <input
          id="up_y"
          type="text"
          value={cameraOptions.up[1]}
          onChange={(e) =>
            setCameraOptions({
              ...cameraOptions,
              up: [
                cameraOptions.up[0],
                Number(e.target.value),
                cameraOptions.up[2],
              ],
            })
          }
        />
        <input
          id="up_z"
          type="text"
          value={cameraOptions.up[2]}
          onChange={(e) =>
            setCameraOptions({
              ...cameraOptions,
              up: [
                cameraOptions.up[0],
                cameraOptions.up[1],
                Number(e.target.value),
              ],
            })
          }
        />
      </div>

      <label htmlFor="vertical_fov">vertical_fov: </label>
      <input
        id="vertical_fov"
        type="text"
        value={cameraOptions.vertical_fov}
        onChange={(e) =>
          setCameraOptions({
            ...cameraOptions,
            vertical_fov: Number(e.target.value),
          })
        }
      />

      <label htmlFor="aperture">aperture: </label>
      <input
        id="aperture"
        type="text"
        value={cameraOptions.aperture}
        onChange={(e) =>
          setCameraOptions({
            ...cameraOptions,
            aperture: Number(e.target.value),
          })
        }
      />

      <label htmlFor="focus_distance">focus_distance: </label>
      <input
        id="focus_distance"
        type="text"
        value={cameraOptions.focus_distance}
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
