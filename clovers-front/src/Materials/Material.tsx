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
}: {
  material: Material;
}): ReactElement => {
  // TODO: can this be done better somehow?
  let kind = Object.keys(material)[0];
  let mat = material[kind];
  switch (kind) {
    case "Dielectric":
      return <DielectricForm material={mat} />;
    case "DiffuseLight":
      return <DiffuseLightForm material={mat} />;
    case "Isotropic":
      return <IsotropicForm material={mat} />;
    case "Lambertian":
      return <LambertianForm material={mat} />;
    case "Metal":
      return <MetalForm material={mat} />;
    default:
      return <DebugForm material={mat} />;
  }
};
