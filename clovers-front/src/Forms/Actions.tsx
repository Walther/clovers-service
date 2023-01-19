import { ReactElement } from "react";
import { Button } from "../Inputs/Button";
import { FileInput } from "../Inputs/File";

const MessageBox = ({ message }: { message: string }): ReactElement => {
  return <p className="MessageBox">{message}</p>;
};

export const ActionForm = ({
  handleSubmit,
  handleImport,
  handleExport,
  message,
}: {
  handleSubmit: any;
  handleImport: any;
  handleExport: any;
  message: string;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>actions</h3>
      <label htmlFor="importFileInput">load from file:</label>
      <FileInput id="importFileInput" />
      <label htmlFor="importButton">click to load:</label>
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
      <hr />
      <label htmlFor="renderButton">render:</label>
      <Button
        id="renderButton"
        handleClick={() => handleSubmit()}
        text="start"
      />
      <MessageBox message={message} />
    </div>
  );
};
