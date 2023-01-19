import * as R from "ramda";
import { ReactElement, useId } from "react";
import { DeleteButton } from "../DeleteButton";
import { NumberInput, TripleNumberInput } from "../Inputs/NumberInput";
import { TextInput } from "../Inputs/TextInput";
import { CheckboxInput } from "../Inputs/CheckboxInput";
import { Material, MaterialForm } from "../Materials/Material";

export type STL = {
  kind: "STL";
  comment?: string;
  path: string;
  scale: number;
  center: [number, number, number];
  rotation: [number, number, number];
  material: Material;
  priority: boolean;
};

export const STLForm = ({
  object,
  path,
  setState,
}: {
  object: STL;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<string>>;
}): ReactElement => {
  const id = useId();
  // TODO: fix this select hackery :x
  const stlLens = R.lensPath([...path, "path"]);
  const selected = object.path ? object.path : ""; // TODO: fix ugly workaround for the new object case
  const setSelected = (value: string) => setState(R.set(stlLens, value));

  return (
    <div className="OptionsForm">
      <h3>STL</h3>
      <DeleteButton path={path} setState={setState} />
      <TextInput
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <STLSelect id={id} selected={selected} setSelected={setSelected} />
      <NumberInput
        fieldname="scale"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="center"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="rotation"
        object={object}
        path={path}
        setState={setState}
      />
      <CheckboxInput
        fieldname="priority"
        object={object}
        path={path}
        setState={setState}
      />
      <MaterialForm
        material={object.material}
        path={[...path, "material"]}
        setState={setState}
      />
    </div>
  );
};

// TODO: user file upload
const STLPaths = ["", "bunny.stl", "dragon.stl", "teapot.stl"];
export const STLSelect = ({
  id,
  selected,
  setSelected,
}: {
  id: string;
  selected: string;
  setSelected: (value: string) => void; // TODO: this is a weird type for this
}): ReactElement => {
  const options = STLPaths.map((name, index) => (
    <option value={"stl/" + name} key={index}>
      {name}
    </option>
  ));
  return (
    <select
      id={id}
      value={selected}
      className={selected === "" ? "InputError" : ""} // TODO: fix ugly workaround for the new object case
      onChange={(e) => setSelected(e.target.value)}
    >
      {options}
    </select>
  );
};
