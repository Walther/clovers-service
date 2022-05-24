import { FormEventHandler, ReactElement } from "react";

export const implicitSceneSettings = {
  time_0: 0,
  time_1: 1,
  background_color: [0, 0, 0],
};

export const SceneForm = ({
  scenefile,
  setScenefile,
  handleSubmit,
}: {
  scenefile: string;
  setScenefile: Function;
  handleSubmit: FormEventHandler;
}): ReactElement => {
  return (
    <form onSubmit={handleSubmit}>
      <h2>scene file</h2>
      <textarea
        value={scenefile}
        onChange={(e) => setScenefile(e.target.value)}
        placeholder={`{"json": "paste your scene file here"}`}
        className="json_input"
      />
      <button type="submit">render</button>
    </form>
  );
};
