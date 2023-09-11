import * as R from "ramda";
import { ReactElement, useId, useState } from "react";
import { Button } from "../Inputs/Button";
import { Dielectric, DielectricForm } from "./Dielectric";
import { DiffuseLight, DiffuseLightForm } from "./DiffuseLight";
import { Isotropic, IsotropicForm } from "./Isotropic";
import { Lambertian, LambertianForm } from "./Lambertian";
import { Metal, MetalForm } from "./Metal";

export type Material =
  | Dielectric
  | DiffuseLight
  | Isotropic
  | Lambertian
  | Metal;

// TODO: can this be cleaner?
const MaterialKinds = [
  "Dielectric",
  "DiffuseLight",
  "Isotropic",
  "Lambertian",
  "Metal",
];

export type Materials = Array<Material>;

export const defaultMaterials: Array<Material> = [
  {
    name: "lamp",
    kind: "DiffuseLight",
    emit: {
      kind: "SolidColor",
      color: [7, 7, 7],
    },
  },
  {
    name: "glass",
    kind: "Dielectric",
    refractive_index: 1.5,
    color: [1, 1, 1],
  },
  {
    name: "green wall",
    kind: "Lambertian",
    albedo: {
      kind: "SolidColor",
      color: [0.12, 0.45, 0.15],
    },
  },
  {
    name: "red wall",
    kind: "Lambertian",
    albedo: {
      kind: "SolidColor",
      color: [0.65, 0.05, 0.05],
    },
  },
  {
    name: "grey wall",
    kind: "Lambertian",
    albedo: {
      kind: "SolidColor",
      color: [0.73, 0.73, 0.73],
    },
  },
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
  setState: React.Dispatch<React.SetStateAction<any>>;
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

export const NewMaterialSelect = ({
  id,
  selected,
  setSelected,
}: {
  id: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}): ReactElement => {
  const options = MaterialKinds.map((name, index) => (
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
  setState: React.Dispatch<React.SetStateAction<any>>;
  path: R.Path;
}): ReactElement => {
  const id = useId();
  const [selected, setSelected] = useState("Lambertian");

  return (
    <div className="OptionsForm">
      <h3>new material</h3>
      <label htmlFor={id}>kind: </label>
      <NewMaterialSelect
        id={id}
        selected={selected}
        setSelected={setSelected}
      />
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
    </div>
  );
};

export const MaterialsForm = ({
  materials,
  setMaterials,
}: {
  materials: Materials;
  setMaterials: any;
}): ReactElement => {
  return (
    <div>
      {materials &&
        materials.map((mat, index) => (
          <details>
            <summary>{mat.name || mat.kind}</summary>
            <MaterialForm
              material={mat}
              path={[index]}
              key={index}
              setState={setMaterials}
            />
          </details>
        ))}
    </div>
  );
};
