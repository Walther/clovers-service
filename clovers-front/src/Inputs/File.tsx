import { ReactElement, useState } from "react";
import "./Input.scss";

export const FileInput = ({ id }: { id: string }): ReactElement => {
  const [name, setName] = useState<string>("select file to import");

  const handleFile = (e: any) => {
    const file = e.target.files[0];
    if (file && file.name) {
      setName(file.name);
    }
  };

  return (
    <>
      <input
        id={id}
        type="file"
        accept=".json"
        onChange={handleFile}
        className="Input fileInput"
      />
      <label title="file input" htmlFor={id} className="fileInputLabel">
        {name}
      </label>
    </>
  );
};
