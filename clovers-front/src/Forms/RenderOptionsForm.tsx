import { ReactElement } from "react";
import { Button } from "../Inputs/Button";
import { NumberInput } from "../Inputs/NumberInput";
import { CheckboxInput } from "../Inputs/CheckboxInput";
import "./RenderOptionsForm.scss";

export type RenderOptions = {
  width: number;
  height: number;
  samples: number;
  max_depth: number;
  gamma: number;
  quiet: boolean;
  normalmap: boolean;
};
export const defaultRenderOptions: RenderOptions = {
  width: 1024,
  height: 1024,
  samples: 10,
  max_depth: 100,
  gamma: 2.0,
  quiet: false,
  normalmap: false,
};

export const RenderOptionsForm = ({
  object,
  setState,
  path,
}: {
  object: RenderOptions;
  setState: React.Dispatch<React.SetStateAction<RenderOptions>>;
  path: R.Path;
}): ReactElement => {
  const max_rays = (
    object.normalmap
      ? object.width * object.height
      : object.width * object.height * object.samples * object.max_depth
  ).toPrecision(3);

  return (
    <div className="OptionsForm">
      <h3>render options</h3>

      <NumberInput
        fieldname="width"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        fieldname="height"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        fieldname="samples"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        fieldname="max_depth"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        fieldname="gamma"
        object={object}
        path={path}
        setState={setState}
      />
      <CheckboxInput
        fieldname="normalmap"
        object={object}
        path={path}
        setState={setState}
      />
      <hr />
      <label htmlFor="est_rays">estimated upper bound for rays:</label>
      <span id="est_rays">{max_rays}</span>
      <hr />
      <label>presets</label>
      <Button
        handleClick={(_e) => setState(defaultRenderOptions)}
        text={"1k*1k"}
      />
      <Button
        handleClick={(_e) =>
          setState({ ...defaultRenderOptions, width: 1920, height: 1080 })
        }
        text={"fullhd"}
      />
      <Button
        handleClick={(_e) =>
          setState({ ...defaultRenderOptions, width: 3840, height: 2160 })
        }
        text={"4k"}
      />
    </div>
  );
};
