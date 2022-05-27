import * as R from "ramda";
import { ReactElement, useId, useState } from "react";
import { Button } from "../Button";
import { DielectricForm } from "./Dielectric";
import { DiffuseLightForm } from "./DiffuseLight";
import { IsotropicForm } from "./Isotropic";
import { LambertianForm } from "./Lambertian";
import { MetalForm } from "./Metal";

/* export type Material =
  | Dielectric
  | DiffuseLight
  | Isotropic
  | Lambertian
  | Metal; */

// TODO: proper material type
export type Material = any;

export const MaterialNames = [
  "Dielectric",
  "DiffuseLight",
  "Isotropic",
  "Lambertian",
  "Metal",
];

const DebugForm = ({ material }: { material: Material }): ReactElement => {
  const id = useId();
  return (
    <div className="OptionsForm">
      <h3>other material</h3>
      <label htmlFor={id}>json: </label>
      <input id={id} type="text" value={JSON.stringify(material)} />
    </div>
  );
};

export const MaterialForm = ({
  material,
  path,
  setState,
}: {
  material: Material;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  if (!material) {
    return (
      <div className="OptionsForm">
        <h3>default material</h3>
        <NewMaterialForm setState={setState} path={path} />
      </div>
    );
  }
  // TODO: can this be done better somehow?
  let kind = Object.keys(material)[0];
  let mat = material[kind];
  switch (kind) {
    case "Dielectric":
      return (
        <DielectricForm
          material={mat}
          path={[...path, "Dielectric"]}
          setState={setState}
        />
      );
    case "DiffuseLight":
      return (
        <DiffuseLightForm
          material={mat}
          path={[...path, "DiffuseLight"]}
          setState={setState}
        />
      );
    case "Isotropic":
      return (
        <IsotropicForm
          material={mat}
          path={[...path, "Isotropic"]}
          setState={setState}
        />
      );
    case "Lambertian":
      return (
        <LambertianForm
          material={mat}
          path={[...path, "Lambertian"]}
          setState={setState}
        />
      );
    case "Metal":
      return (
        <MetalForm
          material={mat}
          path={[...path, "Metal"]}
          setState={setState}
        />
      );
    default:
      return <DebugForm material={mat} />;
  }
};

export const MaterialSelect = ({
  id,
  selected,
  setSelected,
}: {
  id: any;
  selected: any;
  setSelected: any;
}): ReactElement => {
  const options = MaterialNames.map((name, index) => (
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

export const NewMaterialForm = ({
  setState,
  path,
}: {
  setState: Function;
  path: any; // TODO: type for ramda path
}): ReactElement => {
  const id = useId();
  const [selected, setSelected] = useState("Lambertian");

  return (
    <>
      <label htmlFor={id}>new material: </label>
      <MaterialSelect id={id} selected={selected} setSelected={setSelected} />
      <Button
        handleClick={() =>
          setState((prevState: any) => {
            const lens: any = R.lensPath(path);
            const value: any = R.view(lens, prevState);
            const valueType = R.type(value);
            switch (valueType) {
              case "Array":
                return R.prepend({ [selected]: {} }, prevState);
              case "Undefined":
                return R.assocPath(path, { [selected]: {} }, prevState);
              default:
                console.error("unexpected value type: ", value);
                return prevState;
            }
          })
        }
        text={"add"}
      />
    </>
  );
};
