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
  path: R.Path;
  setState: any;
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
  switch (material.kind) {
    case "Dielectric":
      return (
        <DielectricForm material={material} path={path} setState={setState} />
      );
    case "DiffuseLight":
      return (
        <DiffuseLightForm material={material} path={path} setState={setState} />
      );
    case "Isotropic":
      return (
        <IsotropicForm material={material} path={path} setState={setState} />
      );
    case "Lambertian":
      return (
        <LambertianForm material={material} path={path} setState={setState} />
      );
    case "Metal":
      return <MetalForm material={material} path={path} setState={setState} />;
    default:
      return <DebugForm material={material} />;
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
  setState: any;
  path: R.Path;
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
                return R.prepend({ kind: selected }, prevState);
              case "Undefined":
                return R.assocPath(path, { kind: selected }, prevState);
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
