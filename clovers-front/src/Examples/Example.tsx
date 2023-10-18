import { ReactElement, useState } from "react";
import { Button } from "../Inputs/Button";
import { exampleNames } from "../io";

export const ExampleSelect = ({
  id,
  selected,
  setSelected,
}: {
  id: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}): ReactElement => {
  const options = exampleNames.map((name, index) => (
    <option value={name} key={index}>
      {name}
    </option>
  ));
  return (
    <select
      id={id}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
    >
      {options}
    </select>
  );
};

export const ExampleForm = ({ handleExample }: { handleExample: any }) => {
  const [selectedExample, setSelectedExample] = useState("cornell");

  return (
    <>
      <label htmlFor="exampleSelect">select example:</label>
      <ExampleSelect
        id={"exampleSelect"}
        selected={selectedExample}
        setSelected={setSelectedExample}
      />
      <label htmlFor="loadExampleButton">load example:</label>
      <Button
        id="loadExampleButton"
        handleClick={() => handleExample()}
        text="load"
      />
    </>
  );
};
