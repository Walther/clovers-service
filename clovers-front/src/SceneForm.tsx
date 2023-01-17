import { ReactElement } from "react";
import { NewObjectForm, ObjectForm, SceneObject } from "./Objects/SceneObject";

export const implicitSceneSettings = {
  time_0: 0,
  time_1: 1,
  background_color: [0, 0, 0],
};

export type SceneObjects = Array<SceneObject>;
export type ScenePriorityObjects = Array<SceneObject>;

export const defaultSceneObjects: SceneObjects = [
  {
    kind: "Quad",
    q: [555, 0, 0],
    u: [0, 0, 555],
    v: [0, 555, 0],
    material: {
      kind: "Lambertian",
      albedo: {
        kind: "SolidColor",
        color: [0.12, 0.45, 0.15],
      },
    },
    comment: "green wall, left",
    priority: false,
  },
  {
    kind: "Quad",
    q: [0, 0, 555],
    u: [0, 0, -555],
    v: [0, 555, 0],
    material: {
      kind: "Lambertian",
      albedo: {
        kind: "SolidColor",
        color: [0.65, 0.05, 0.05],
      },
    },
    comment: "red wall, right",
    priority: false,
  },
  {
    kind: "Quad",
    q: [0, 0, 0],
    u: [555, 0, 0],
    v: [0, 0, 555],
    material: {
      kind: "Lambertian",
      albedo: {
        kind: "SolidColor",
        color: [0.73, 0.73, 0.73],
      },
    },
    comment: "floor",
    priority: false,
  },
  {
    kind: "Quad",
    q: [0, 555, 0],
    u: [555, 0, 0],
    v: [0, 0, 555],
    material: {
      kind: "Lambertian",
      albedo: {
        kind: "SolidColor",
        color: [0.73, 0.73, 0.73],
      },
    },
    comment: "ceiling",
    priority: false,
  },
  {
    kind: "Quad",
    q: [0, 0, 555],
    u: [555, 0, 0],
    v: [0, 555, 0],
    material: {
      kind: "Lambertian",
      albedo: {
        kind: "SolidColor",
        color: [0.73, 0.73, 0.73],
      },
    },
    comment: "back wall",
    priority: false,
  },
  {
    kind: "Quad",
    q: [113, 554, 127],
    u: [330, 0, 0],
    v: [0, 0, 305],
    material: {
      kind: "DiffuseLight",
      emit: {
        kind: "SolidColor",
        color: [7, 7, 7],
      },
    },
    comment: "big ceiling light",
    priority: true,
  },
  {
    kind: "Translate",
    offset: [265, 0, 295],
    comment: "moved tall box",
    priority: false,
    object: {
      kind: "RotateY",
      angle: 15,
      comment: "rotated tall box",
      priority: false,
      object: {
        kind: "Boxy",
        corner_0: [0, 0, 0],
        corner_1: [165, 330, 165],
        priority: false,
        material: {
          kind: "Lambertian",
          albedo: {
            kind: "SolidColor",
            color: [0.73, 0.73, 0.73],
          },
        },
        comment: "tall box",
      },
    },
  },
  {
    kind: "Sphere",
    center: [190, 90, 190],
    radius: 90,
    material: {
      kind: "Dielectric",
      refractive_index: 1.5,
      color: [1, 1, 1],
    },
    comment: "glass sphere",
    priority: true,
  },
];

export const SceneForm = ({
  sceneObjects,
  setSceneObjects,
}: {
  sceneObjects: SceneObjects;
  setSceneObjects: any;
}): ReactElement => {
  return (
    <div>
      <h2>objects</h2>
      <div className="OptionsGroup">
        <NewObjectForm setState={setSceneObjects} path={[]} />
        {sceneObjects &&
          sceneObjects.map((obj, index) => (
            <ObjectForm
              object={obj}
              path={[index]}
              key={index}
              setState={setSceneObjects}
            />
          ))}
      </div>
    </div>
  );
};
