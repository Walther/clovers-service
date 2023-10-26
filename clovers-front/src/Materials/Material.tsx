import * as R from "ramda";
import { ReactElement, useId, useState } from "react";
import { Button } from "../Inputs/Button";
import { Dielectric, DielectricForm } from "./Dielectric";
import { DiffuseLight, DiffuseLightForm } from "./DiffuseLight";
import { Isotropic, IsotropicForm } from "./Isotropic";
import { Lambertian, LambertianForm } from "./Lambertian";
import { Metal, MetalForm } from "./Metal";
import { Dispersive, DispersiveForm } from "./Dispersive";
import cornell from "../Examples/cornell.json";

export type Material =
  | Dielectric
  | Dispersive
  | DiffuseLight
  | Isotropic
  | Lambertian
  | Metal;

// TODO: can this be cleaner?
const MaterialKinds = [
  "Dielectric",
  "Dispersive",
  "DiffuseLight",
  "Isotropic",
  "Lambertian",
  "Metal",
];

export type Materials = Array<Material>;

export const defaultMaterials: Materials = cornell.materials as Materials;

const DebugForm = ({ material }: { material: Material }): ReactElement => {
  const id = useId();
  return (
    <div className="OptionsForm">
      <h3>other material</h3>
      <label title="json for the unknown material" htmlFor={id}>
        json:
      </label>
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
    case "Dispersive":
      return (
        <DispersiveForm material={material} path={path} setState={setState} />
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
  const [hex, setHex] = useState("#000000");
  const [srgb, setSrgb] = useState([0.0, 0.0, 0.0]);

  const handleHex = (hex: string) => {
    setHex(hex);

    if (hex.length === 4) {
      let r: any = "0x" + hex[1] + hex[1];
      let g: any = "0x" + hex[2] + hex[2];
      let b: any = "0x" + hex[3] + hex[3];

      r = r / 255.0;
      g = g / 255.0;
      b = b / 255.0;

      setSrgb([r, g, b]);
    }

    if (hex.length === 7) {
      let r: any = "0x" + hex[1] + hex[2];
      let g: any = "0x" + hex[3] + hex[4];
      let b: any = "0x" + hex[5] + hex[6];

      r = r / 255.0;
      g = g / 255.0;
      b = b / 255.0;

      setSrgb([r, g, b]);
    }
  };

  return (
    <div className="OptionsForm">
      <h3>new material</h3>
      <label title="select the type of the new material to add" htmlFor={id}>
        kind:
      </label>
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
      <hr />
      <h3>color helper</h3>
      <label
        title="hex representation of a color, #abc or #abcdef"
        htmlFor={"colorHelper"}
      >
        hex input:
      </label>
      <input
        id={"colorHelper"}
        type="text"
        value={hex}
        className="Input"
        onChange={(e) => handleHex(e.target.value)}
      />
      <label title={"red"} htmlFor={"red"}>
        red:
      </label>
      <input id={"colorHelper_red"} type="text" value={srgb[0]} disabled />
      <label title={"green"} htmlFor={"green"}>
        green:
      </label>
      <input id={"colorHelper_green"} type="text" value={srgb[1]} disabled />
      <label title={"blue"} htmlFor={"blue"}>
        blue:
      </label>
      <input id={"colorHelper_blue"} type="text" value={srgb[2]} disabled />
      <label title={"result"} htmlFor={"result"}>
        result:
      </label>
      <input
        id={"colorHelper_result"}
        type="text"
        disabled
        style={{ background: hex, opacity: 1 }}
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
