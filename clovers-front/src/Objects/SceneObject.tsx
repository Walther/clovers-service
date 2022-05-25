import { ReactElement } from "react";
import { Boxy, BoxyForm } from "./Boxy";
import { ConstantMedium, ConstantMediumForm } from "./ConstantMedium";
import { FlipFace, FlipFaceForm } from "./FlipFace";
import { MovingSphere, MovingSphereForm } from "./MovingSphere";
import { Quad, QuadForm } from "./Quad";
import { Rotate, RotateYForm } from "./Rotate";
import { Sphere, SphereForm } from "./Sphere";
import { STL, STLForm } from "./STL";
import { Translate, TranslateForm } from "./Translate";
import { Triangle, TriangleForm } from "./Triangle";

/*
export type SceneObject =
  | Boxy
  | ConstantMedium
  | FlipFace
  | MovingSphere
  | Quad
  | Rotate
  | Sphere
  | STL
  | Translate
  | Triangle
*/
export type SceneObject = any; // TODO: proper types

const DebugForm = ({ object }: { object: SceneObject }): ReactElement => {
  const name = Object.keys(object)[0];
  return (
    <div className="OptionsForm">
      <h3>other object: {name}</h3>
      <label htmlFor="json">json: </label>
      <input id="json" type="text" value={JSON.stringify(object)} />
    </div>
  );
};

export const ObjectForm = ({
  object,
}: {
  object: SceneObject;
}): ReactElement => {
  // TODO: can this be done better somehow?
  let kind = Object.keys(object)[0];
  switch (kind) {
    case "Boxy":
      return <BoxyForm object={object[kind] as Boxy} />;
    case "ConstantMedium":
      return <ConstantMediumForm object={object[kind] as ConstantMedium} />;
    case "FlipFace":
      return <FlipFaceForm object={object[kind] as FlipFace} />;
    case "MovingSphere":
      return <MovingSphereForm object={object[kind] as MovingSphere} />;
    case "Quad":
      return <QuadForm object={object[kind] as Quad} />;
    case "RotateY":
      return <RotateYForm object={object[kind] as Rotate} />;
    case "Sphere":
      return <SphereForm object={object[kind] as Sphere} />;
    case "STL":
      return <STLForm object={object[kind] as STL} />;
    case "Translate":
      return <TranslateForm object={object[kind] as Translate} />;
    case "Triangle":
      return <TriangleForm object={object[kind] as Triangle} />;
    default:
      return <DebugForm object={object} />;
  }
};
