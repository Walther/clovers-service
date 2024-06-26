import { ReactElement } from "react";
import { ObjectForm, SceneObject } from "../Objects/SceneObject";
import cornell from "../Examples/cornell.json";

export type SceneObjects = Array<SceneObject>;
export type ScenePriorityObjects = Array<SceneObject>;

export const defaultSceneObjects: SceneObjects =
  cornell.objects as SceneObjects;

export const ObjectsForm = ({
  sceneObjects,
  setSceneObjects,
}: {
  sceneObjects: SceneObjects;
  setSceneObjects: any;
}): ReactElement => {
  return (
    <div>
      {sceneObjects &&
        sceneObjects.map((obj, index) => (
          <details>
            <summary>{obj.comment || obj.kind}</summary>
            <ObjectForm
              object={obj}
              path={[index]}
              key={index}
              setState={setSceneObjects}
            />
          </details>
        ))}
    </div>
  );
};
