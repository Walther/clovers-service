import { ReactElement, useId } from "react";
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

const DebugForm = ({ material }: { material: Material }): ReactElement => {
  const id = useId();
  return (
    <div className="OptionsForm">
      <h3>material</h3>
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
  const id = useId();
  if (!material) {
    return (
      <div className="OptionsForm">
        <h3>material</h3>
        <label htmlFor={id}>not set: </label>
        <input id={id} type="text" value="default will be used" readOnly />
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
