import { FormEventHandler, ReactElement } from "react";

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
