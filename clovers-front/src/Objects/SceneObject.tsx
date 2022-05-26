import { ReactElement, useId } from "react";
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
  const id = useId();
  const name = Object.keys(object)[0];
  return (
    <div className="OptionsForm">
      <h3>other object: {name}</h3>
      <label htmlFor={id}>json: </label>
      <input id={id} type="text" value={JSON.stringify(object)} />
    </div>
  );
};

export const ObjectForm = ({
  object,
  index,
  setState,
}: {
  object: SceneObject;
  index: number;
  setState: Function;
}): ReactElement => {
  // TODO: can this be done better somehow?
  let kind = Object.keys(object)[0];
  switch (kind) {
    case "Boxy":
      return (
        <BoxyForm
          object={object[kind] as Boxy}
          index={index}
          setState={setState}
        />
      );
    case "ConstantMedium":
      return (
        <ConstantMediumForm
          object={object[kind] as ConstantMedium}
          index={index}
          setState={setState}
        />
      );
    case "FlipFace":
      return (
        <FlipFaceForm
          object={object[kind] as FlipFace}
          index={index}
          setState={setState}
        />
      );
    case "MovingSphere":
      return (
        <MovingSphereForm
          object={object[kind] as MovingSphere}
          index={index}
          setState={setState}
        />
      );
    case "Quad":
      return (
        <QuadForm
          object={object[kind] as Quad}
          index={index}
          setState={setState}
        />
      );
    case "RotateY":
      return (
        <RotateYForm
          object={object[kind] as Rotate}
          index={index}
          setState={setState}
        />
      );
    case "Sphere":
      return (
        <SphereForm
          object={object[kind] as Sphere}
          index={index}
          setState={setState}
        />
      );
    case "STL":
      return (
        <STLForm
          object={object[kind] as STL}
          index={index}
          setState={setState}
        />
      );
    case "Translate":
      return (
        <TranslateForm
          object={object[kind] as Translate}
          index={index}
          setState={setState}
        />
      );
    case "Triangle":
      return (
        <TriangleForm
          object={object[kind] as Triangle}
          index={index}
          setState={setState}
        />
      );
    default:
      return <DebugForm object={object} />;
  }
};
