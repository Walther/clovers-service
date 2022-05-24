import { Button } from "./Button";
import "./RenderOptions.scss";

export type RenderOptions = {
  width: number;
  height: number;
  samples: number;
  max_depth: number;
  gamma: number;
  quiet: boolean;
  normalmap: boolean;
};
export const render_default_options: RenderOptions = {
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
}) => {
  return (
    <div className="RenderOptionsForm">
      <h2>render options</h2>

      <label htmlFor="width">width: </label>
      <input
        id="width"
        type="text"
        value={renderOptions.width}
        onChange={(e) =>
          setRenderOptions({
            ...renderOptions,
            width: Number(e.target.value),
          })
        }
      />

      <label htmlFor="height">height: </label>
      <input
        id="height"
        type="text"
        value={renderOptions.height}
        onChange={(e) =>
          setRenderOptions({
            ...renderOptions,
            height: Number(e.target.value),
          })
        }
      />

      <label htmlFor="samples">samples: </label>
      <input
        id="samples"
        type="text"
        value={renderOptions.samples}
        onChange={(e) =>
          setRenderOptions({
            ...renderOptions,
            samples: Number(e.target.value),
          })
        }
      />

      <Button
        handleClick={(_e) => setRenderOptions(render_default_options)}
        text={"defaults"}
      />
    </div>
  );
};
