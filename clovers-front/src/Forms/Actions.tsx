import { ReactElement } from "react";
import { Button } from "../Inputs/Button";
import { FileInput } from "../Inputs/File";
import { ExampleForm } from "../Examples/Example";

export const ActionForm = ({
  handlePreview,
  handleRender,
  handleImport,
  handleExport,
  handleExample,
}: {
  handlePreview: any;
  handleRender: any;
  handleImport: any;
  handleExport: any;
  handleExample: any;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>path tracing</h3>
      <label title="create a quick preview render" htmlFor="previewButton">
        preview:
      </label>
      <Button
        id="previewButton"
        handleClick={() => handlePreview()}
        text="start"
      />
      <label
        title="create a task for a higher-quality render"
        htmlFor="renderButton"
      >
        render:
      </label>
      <Button
        id="renderButton"
        handleClick={() => handleRender()}
        text="start"
      />
      <hr />
      <h3>examples</h3>
      <ExampleForm handleExample={handleExample} />
      <hr />
      <h3>import</h3>
      <FileInput id="importFileInput" />
      <label
        title="load the selected file, replacing the current scene"
        htmlFor="importButton"
      >
        load selected file:
      </label>
      <Button
        id="importButton"
        handleClick={() => handleImport()}
        text="import"
      />
      <hr />
      <h3>export</h3>
      <label
        title="export the current scene into a file"
        htmlFor="exportButton"
      >
        save to file:
      </label>
      <Button
        id="exportButton"
        handleClick={() => handleExport()}
        text="export"
      />
    </div>
  );
};
