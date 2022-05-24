import { ReactElement } from "react";
import { Button } from "./Button";

export const implicitSceneSettings = {
  time_0: 0,
  time_1: 1,
  background_color: [0, 0, 0],
};

export type Scene = {
  objects: Array<Object>;
  priority_objects: Array<Object>;
};

export const defaultScene: Scene = {
  objects: [
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
      Translate: {
        offset: [265.0, 0.0, 295.0],
        object: {
          RotateY: {
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
                comment: "rotated tall box",
              },
            },
          },
        },
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
  ],
  priority_objects: [
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
      },
    },
  ],
};

export const SceneForm = ({
  scene,
  setScene,
}: {
  scene: Scene;
  setScene: Function;
}): ReactElement => {
  return (
    <div>
      <h2>scene</h2>
      <textarea
        id="scene"
        value={JSON.stringify(scene)}
        onChange={(e) => setScene(JSON.parse(e.target.value))}
        placeholder={`{"json": "paste your scene file here"}`}
        className="json_input"
      />
      <Button handleClick={(_e) => setScene(defaultScene)} text={"defaults"} />
    </div>
  );
};
