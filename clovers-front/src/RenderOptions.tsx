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
  renderOptions,
  setRenderOptions,
}: {
  renderOptions: RenderOptions;
  setRenderOptions: Function;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>render</h3>

      <Input
        fieldname="width"
        object={renderOptions}
        onChange={(e) =>
          setRenderOptions({
            ...renderOptions,
            width: Number(e.target.value),
          })
        }
      />
      <Input
        fieldname="height"
        object={renderOptions}
        onChange={(e) =>
          setRenderOptions({
            ...renderOptions,
            height: Number(e.target.value),
          })
        }
      />
      <Input
        fieldname="samples"
        object={renderOptions}
        onChange={(e) =>
          setRenderOptions({
            ...renderOptions,
            samples: Number(e.target.value),
          })
        }
      />

      <Button
        handleClick={(_e) => setRenderOptions(defaultRenderOptions)}
        text={"defaults"}
      />
    </div>
  );
};
