import { ReactElement } from "react";
import { Button } from "../Inputs/Button";
import { NumberInput } from "../Inputs/Number";
import { CheckboxInput } from "../Inputs/Checkbox";
import "./RenderOptions.scss";

export type RenderOptions = {
  width: number;
  height: number;
  samples: number;
  max_depth: number;
  quiet: boolean;
  normalmap: boolean;
};
export const defaultRenderOptions: RenderOptions = {
  width: 1024,
  height: 1024,
  samples: 10,
  max_depth: 100,
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
  const pixels = object.width * object.height;
  const maxRaysM = Math.round(
    (object.normalmap ? pixels : pixels * object.samples * object.max_depth) /
      1000000
  );

  return (
    <div className="OptionsForm">
      <h3>render options</h3>

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

      <hr />

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
      <CheckboxInput
        fieldname="normalmap"
        object={object}
        path={path}
        setState={setState}
      />
      <hr />
      <label htmlFor="est_rays">estimated upper bound for rays:</label>
      <span id="est_rays">{maxRaysM} M</span>
    </div>
  );
};
