import { ReactElement } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
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
  setState: Function;
  path: any; // TODO: ramda path type
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>render</h3>

      <Input
        fieldname="width"
        object={object}
        path={[...path, "width"]}
        setState={setState}
      />
      <Input
        fieldname="height"
        object={object}
        path={[...path, "height"]}
        setState={setState}
      />
      <Input
        fieldname="samples"
        object={object}
        path={[...path, "samples"]}
        setState={setState}
      />

      <Button
        handleClick={(_e) => setState(defaultRenderOptions)}
        text={"defaults"}
      />
    </div>
  );
};
