import { ReactElement } from "react";
import { Button } from "./Button";
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
  },
  {
    kind: "Translate",
    offset: [265, 0, 295],
    comment: "moved tall box",
    object: {
      kind: "RotateY",
      angle: 15,
      comment: "rotated tall box",
      object: {
        kind: "Boxy",
        corner_0: [0, 0, 0],
        corner_1: [165, 330, 165],
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
  },
];

export const defaultScenePriorityObjects: SceneObjects = [
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
  },
];

export const SceneForm = ({
  sceneObjects,
  setSceneObjects,
  scenePriorityObjects,
  setScenePriorityObjects,
}: {
  sceneObjects: SceneObjects;
  setSceneObjects: Function;
  scenePriorityObjects: ScenePriorityObjects;
  setScenePriorityObjects: Function;
}): ReactElement => {
  return (
    <div>
      <h2>objects</h2>
      <div className="OptionsGroup">
        <NewObjectForm setState={setSceneObjects} path={[]} />
        {sceneObjects.map((obj, index) => (
          <ObjectForm
            object={obj}
            path={[index]}
            key={index}
            setState={setSceneObjects}
          />
        ))}
      </div>
      <details>
        <summary>objects json debug</summary>
        <p>select all &amp; paste json here</p>
        <textarea
          id="objects"
          value={JSON.stringify(sceneObjects, null, 2)}
          onChange={(e) => setSceneObjects(JSON.parse(e.target.value))}
          className="json_input"
        />
        <Button
          handleClick={(_e) => setSceneObjects(defaultSceneObjects)}
          text="or reset to default"
        />
      </details>
      <h2>priority objects</h2>
      <div className="OptionsGroup">
        <NewObjectForm setState={setScenePriorityObjects} path={[]} />
        {scenePriorityObjects.map((obj, index) => (
          <ObjectForm
            object={obj}
            path={[index]}
            key={index}
            setState={setScenePriorityObjects}
          />
        ))}
      </div>
      <details>
        <summary>priority objects json debug</summary>
        <p>select all &amp; paste json here</p>
        <textarea
          id="priority_objects"
          value={JSON.stringify(scenePriorityObjects, null, 2)}
          onChange={(e) => setScenePriorityObjects(JSON.parse(e.target.value))}
          className="json_input"
        />
        <Button
          handleClick={(_e) =>
            setScenePriorityObjects(defaultScenePriorityObjects)
          }
          text="or reset to default"
        />
      </details>
    </div>
  );
};
