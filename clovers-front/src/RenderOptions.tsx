import { ReactElement } from "react";
import { Button } from "./Button";
import { CheckboxInput, NumberInput } from "./Input";
import "./OptionsForm.scss";

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
  setState: any;
  path: any; // TODO: ramda path type
}): ReactElement => {
  const max_rays = (
    object.normalmap
      ? object.width * object.height
      : object.width * object.height * object.samples * object.max_depth
  ).toPrecision(3);

  return (
    <div className="OptionsForm">
      <h3>render</h3>

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
      <label htmlFor="est_rays">estimated upper bound for rays:</label>
      <input id="est_rays" readOnly value={max_rays}></input>
      <Button
        handleClick={(_e) => setState(defaultRenderOptions)}
        text={"defaults"}
      />
    </div>
  );
};
