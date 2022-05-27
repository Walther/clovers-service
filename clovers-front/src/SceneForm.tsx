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
    Quad: {
      q: [555.0, 0.0, 0.0],
      u: [0.0, 0.0, 555.0],
      v: [0.0, 555.0, 0.0],
      material: {
        Lambertian: {
          albedo: {
            SolidColor: {
              color: [0.12, 0.45, 0.15],
            },
          },
        },
      },
      comment: "green wall, left",
    },
  },
  {
    Quad: {
      q: [0.0, 0.0, 555.0],
      u: [0.0, 0.0, -555.0],
      v: [0.0, 555.0, 0.0],
      material: {
        Lambertian: {
          albedo: {
            SolidColor: {
              color: [0.65, 0.05, 0.05],
            },
          },
        },
      },
      comment: "red wall, right",
    },
  },
  {
    Quad: {
      q: [0.0, 0.0, 0.0],
      u: [555.0, 0.0, 0.0],
      v: [0.0, 0.0, 555.0],
      material: {
        Lambertian: {
          albedo: {
            SolidColor: {
              color: [0.73, 0.73, 0.73],
            },
          },
        },
      },
      comment: "floor",
    },
  },
  {
    Quad: {
      q: [0.0, 555.0, 0.0],
      u: [555.0, 0.0, 0.0],
      v: [0.0, 0.0, 555.0],
      material: {
        Lambertian: {
          albedo: {
            SolidColor: {
              color: [0.73, 0.73, 0.73],
            },
          },
        },
      },
      comment: "ceiling",
    },
  },
  {
    Quad: {
      q: [0.0, 0.0, 555.0],
      u: [555.0, 0.0, 0.0],
      v: [0.0, 555.0, 0.0],
      material: {
        Lambertian: {
          albedo: {
            SolidColor: {
              color: [0.73, 0.73, 0.73],
            },
          },
        },
      },
      comment: "back wall",
    },
  },
  {
    Quad: {
      q: [113.0, 554.0, 127.0],
      u: [330.0, 0.0, 0.0],
      v: [0.0, 0.0, 305.0],
      material: {
        DiffuseLight: {
          emit: {
            SolidColor: {
              color: [7.0, 7.0, 7.0],
            },
          },
        },
      },
      comment: "big ceiling light",
    },
  },
  {
    Sphere: {
      center: [190.0, 90.0, 190.0],
      radius: 90.0,
      material: {
        Dielectric: {
          refractive_index: 1.5,
          color: [1.0, 1.0, 1.0],
        },
      },
      comment: "glass sphere",
    },
  },
  {
    Translate: {
      comment: "moved rotated tall box",
      offset: [265.0, 0.0, 295.0],
      object: {
        RotateY: {
          comment: "rotated tall box",
          angle: 15.0,
          object: {
            Boxy: {
              corner_0: [0.0, 0.0, 0.0],
              corner_1: [165.0, 330.0, 165.0],
              material: {
                Lambertian: {
                  albedo: {
                    SolidColor: {
                      color: [0.73, 0.73, 0.73],
                    },
                  },
                },
              },
              comment: "tall box",
            },
          },
        },
      },
    },
  },
];

export const defaultScenePriorityObjects: SceneObjects = [
  {
    Quad: {
      q: [113.0, 554.0, 127.0],
      u: [330.0, 0.0, 0.0],
      v: [0.0, 0.0, 305.0],
      material: {
        DiffuseLight: {
          emit: {
            SolidColor: {
              color: [7.0, 7.0, 7.0],
            },
          },
        },
      },
      comment: "big ceiling light",
    },
  },
  {
    Sphere: {
      center: [190.0, 90.0, 190.0],
      radius: 90.0,
      material: {
        Dielectric: {
          refractive_index: 1.5,
          color: [1.0, 1.0, 1.0],
        },
      },
      comment: "glass sphere",
    },
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
        <summary>objects json import</summary>
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
        <summary>priority objects json import</summary>
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
