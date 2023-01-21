import { ReactElement } from "react";
import { Button } from "../Inputs/Button";
import { FileInput } from "../Inputs/File";

const MessageBox = ({ message }: { message: string }): ReactElement => {
  return <p className="MessageBox">{message}</p>;
};

export const ActionForm = ({
  handlePreview,
  handleRender,
  handleImport,
  handleExport,
  message,
}: {
  handlePreview: any;
  handleRender: any;
  handleImport: any;
  handleExport: any;
  message: string;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>actions</h3>
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
      <FileInput id="importFileInput" />
      <label htmlFor="importButton">load selected file:</label>
      <Button
        id="importButton"
        handleClick={() => handleImport()}
        text="import"
      />
      <label htmlFor="exportButton">save to file:</label>
      <Button
        id="exportButton"
        handleClick={() => handleExport()}
        text="export"
      />

      <MessageBox message={message} />
    </div>
  );
};
