import * as R from "ramda";
import { ReactElement, useId, useState } from "react";
import { Button } from "../Button";
import { Boxy, BoxyForm } from "./Boxy";
import { ConstantMedium, ConstantMediumForm } from "./ConstantMedium";
import { FlipFace, FlipFaceForm } from "./FlipFace";
import { MovingSphere, MovingSphereForm } from "./MovingSphere";
import { Quad, QuadForm } from "./Quad";
import { RotateY, RotateYForm } from "./RotateY";
import { Sphere, SphereForm } from "./Sphere";
import { STL, STLForm } from "./STL";
import { Translate, TranslateForm } from "./Translate";
import { Triangle, TriangleForm } from "./Triangle";

export type SceneObject =
  | Boxy
  | ConstantMedium
  | FlipFace
  | MovingSphere
  | Quad
  | RotateY
  | Sphere
  | STL
  | Translate
  | Triangle;

export const SceneObjectNames = [
  "Boxy",
  "ConstantMedium",
  "FlipFace",
  "MovingSphere",
  "Quad",
  "RotateY",
  "Sphere",
  "STL",
  "Translate",
  "Triangle",
];

const DebugForm = ({ object }: { object: SceneObject }): ReactElement => {
  const id = useId();
  const name = Object.keys(object)[0];
  return (
    <div className="OptionsForm">
      <h3>other object: {name}</h3>
      <label htmlFor={id}>json: </label>
      <input id={id} type="text" value={JSON.stringify(object)} readOnly />
    </div>
  );
};

export const ObjectForm = ({
  object,
  setState,
  path,
}: {
  object: SceneObject;
  setState: React.Dispatch<React.SetStateAction<any>>;
  path: R.Path;
}): ReactElement => {
  // TODO: possibly better handling?
  if (!object) {
    return (
      <div className="OptionsForm">
        <h3>object not set</h3>
        <NewObjectForm setState={setState} path={path} />
      </div>
    );
  }
  // TODO: can this be done better somehow?
  switch (object.kind) {
    case "Boxy":
      return (
        <BoxyForm object={object as Boxy} setState={setState} path={path} />
      );
    case "ConstantMedium":
      return (
        <ConstantMediumForm
          object={object as ConstantMedium}
          setState={setState}
          path={path}
        />
      );
    case "FlipFace":
      return (
        <FlipFaceForm
          object={object as FlipFace}
          setState={setState}
          path={path}
        />
      );
    case "MovingSphere":
      return (
        <MovingSphereForm
          object={object as MovingSphere}
          setState={setState}
          path={path}
        />
      );
    case "Quad":
      return (
        <QuadForm object={object as Quad} setState={setState} path={path} />
      );
    case "RotateY":
      return (
        <RotateYForm
          object={object as RotateY}
          setState={setState}
          path={path}
        />
      );
    case "Sphere":
      return (
        <SphereForm object={object as Sphere} setState={setState} path={path} />
      );
    case "STL":
      return <STLForm object={object as STL} setState={setState} path={path} />;
    case "Translate":
      return (
        <TranslateForm
          object={object as Translate}
          setState={setState}
          path={path}
        />
      );
    case "Triangle":
      return (
        <TriangleForm
          object={object as Triangle}
          setState={setState}
          path={path}
        />
      );
    default:
      return <DebugForm object={object} />;
  }
};

export const ObjectSelect = ({
  id,
  selected,
  setSelected,
}: {
  id: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}): ReactElement => {
  const options = SceneObjectNames.map((name, index) => (
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

export const NewObjectForm = ({
  setState,
  path,
}: {
  setState: any;
  path: R.Path;
}): ReactElement => {
  const id = useId();
  const [selected, setSelected] = useState("Boxy");

  return (
    <div className="OptionsForm">
      <h3>add an object</h3>
      <label htmlFor={id}>type: </label>
      <ObjectSelect id={id} selected={selected} setSelected={setSelected} />
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
