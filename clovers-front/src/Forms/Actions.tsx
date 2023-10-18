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
      <h3>raytrace</h3>
      <label htmlFor="previewButton">preview:</label>
      <Button
        id="previewButton"
        handleClick={() => handlePreview()}
        text="start"
      />
      <label htmlFor="renderButton">render:</label>
      <Button
        id="renderButton"
        handleClick={() => handleRender()}
        text="start"
      />
      <hr />
      <h3>import</h3>
      <FileInput id="importFileInput" />
      <label htmlFor="importButton">load selected file:</label>
      <Button
        id="importButton"
        handleClick={() => handleImport()}
        text="import"
      />
      <hr />
      <h3>export</h3>
      <label htmlFor="exportButton">save to file:</label>
      <Button
        id="exportButton"
        handleClick={() => handleExport()}
        text="export"
      />
      <hr />
      <h3>examples</h3>
      <ExampleForm handleExample={handleExample} />
    </div>
  );
};
