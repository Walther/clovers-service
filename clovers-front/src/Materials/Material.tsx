import { ReactElement } from "react";
import { Input, TripleInput } from "../Input";
import { Texture } from "../Textures/Texture";

export type Dielectric = {
  color: [number, number, number];
  refractive_index: number;
};

export const DielectricForm = ({
  material,
}: {
  material: Dielectric;
}): ReactElement => {
  const mat = "Dielectric";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor="type">type: </label>
      <select id="type">
        <option>{mat}</option>
      </select>
      <Input fieldname="refractive_index" object={material} />
      <TripleInput fieldname="color" object={material} />
    </div>
  );
};

export type DiffuseLight = {
  emit: Texture;
};

export const DiffuseLightForm = ({
  material,
}: {
  material: DiffuseLight;
}): ReactElement => {
  const mat = "DiffuseLight";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor="type">type: </label>
      <select id="type">
        <option>{mat}</option>
      </select>
      <Input fieldname="emit" object={material} stringify={true} />
    </div>
  );
};

export type Isotropic = {
  albedo: Texture;
};

export const IsotropicForm = ({
  material,
}: {
  material: Isotropic;
}): ReactElement => {
  const mat = "Isotropic";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor="type">type: </label>
      <select id="type">
        <option>{mat}</option>
      </select>
      <Input fieldname="albedo" object={material} stringify={true} />
    </div>
  );
};

export type Lambertian = {
  albedo: Texture;
};

export const LambertianForm = ({
  material,
}: {
  material: Lambertian;
}): ReactElement => {
  const mat = "Lambertian";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor="type">type: </label>
      <select id="type">
        <option>{mat}</option>
      </select>
      <Input fieldname="albedo" object={material} stringify={true} />
    </div>
  );
};

export type Metal = {
  albedo: Texture;
  fuzz: number;
};

export const MetalForm = ({ material }: { material: Metal }): ReactElement => {
  const mat = "Metal";
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor="type">type: </label>
      <select id="type">
        <option>{mat}</option>
      </select>
      <Input fieldname="albedo" object={material} stringify={true} />
      <Input fieldname="fuzz" object={material} />
    </div>
  );
};

/* export type Material =
  | Dielectric
  | DiffuseLight
  | Isotropic
  | Lambertian
  | Metal; */

// TODO: proper material type
export type Material = any;

const DebugForm = ({ material }: { material: Material }): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <label htmlFor="json">json: </label>
      <input id="json" type="text" value={JSON.stringify(material)} />
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
