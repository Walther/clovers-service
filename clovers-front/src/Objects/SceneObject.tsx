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
  setState,
  path,
}: {
  object: SceneObject;
  setState: Function;
  path: any; // TODO: type for ramda path
}): ReactElement => {
  const id = useId();
  // TODO: possibly better handling?
  if (!object) {
    return (
      <div className="OptionsForm">
        <h3>object</h3>
        <label htmlFor={id}>not set: </label>
        {/* Note: this should in theory only appear as part of a metaobject, hence the message */}
        <input
          id={id}
          type="text"
          value="needs a subobject"
          readOnly
          className="inputError"
        />
      </div>
    );
  }
  // TODO: can this be done better somehow?
  let kind = Object.keys(object)[0];
  switch (kind) {
    case "Boxy":
      return (
        <BoxyForm
          object={object[kind] as Boxy}
          setState={setState}
          path={[...path, "Boxy"]}
        />
      );
    case "ConstantMedium":
      return (
        <ConstantMediumForm
          object={object[kind] as ConstantMedium}
          setState={setState}
          path={[...path, "ConstantMedium"]}
        />
      );
    case "FlipFace":
      return (
        <FlipFaceForm
          object={object[kind] as FlipFace}
          setState={setState}
          path={[...path, "FlipFace"]}
        />
      );
    case "MovingSphere":
      return (
        <MovingSphereForm
          object={object[kind] as MovingSphere}
          setState={setState}
          path={[...path, "MovingSphere"]}
        />
      );
    case "Quad":
      return (
        <QuadForm
          object={object[kind] as Quad}
          setState={setState}
          path={[...path, "Quad"]}
        />
      );
    case "RotateY":
      return (
        <RotateYForm
          object={object[kind] as Rotate}
          setState={setState}
          path={[...path, "RotateY"]}
        />
      );
    case "Sphere":
      return (
        <SphereForm
          object={object[kind] as Sphere}
          setState={setState}
          path={[...path, "Sphere"]}
        />
      );
    case "STL":
      return (
        <STLForm
          object={object[kind] as STL}
          setState={setState}
          path={[...path, "STL"]}
        />
      );
    case "Translate":
      return (
        <TranslateForm
          object={object[kind] as Translate}
          setState={setState}
          path={[...path, "Translate"]}
        />
      );
    case "Triangle":
      return (
        <TriangleForm
          object={object[kind] as Triangle}
          setState={setState}
          path={[...path, "Triangle"]}
        />
      );
    default:
      return <DebugForm object={object} />;
  }
};
