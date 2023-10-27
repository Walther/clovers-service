import { SceneObjects } from "./Forms/ObjectsForm";
import { CameraOptions } from "./Forms/Camera";
import { RenderOptions } from "./Forms/RenderOptions";
import { Materials } from "./Materials/Material";
import { SceneOptions } from "./Forms/Scene";

import boing from "./Examples/boing.json";
import colorchecker from "./Examples/colorchecker.json";
import cornell from "./Examples/cornell.json";
import cornell_with_smoke from "./Examples/cornell_with_smoke.json";
import dispersive from "./Examples/dispersive.json";
import grey from "./Examples/grey.json";
import one_weekend from "./Examples/one_weekend.json";
import scene from "./Examples/scene.json";
import spatial_checker_smoke from "./Examples/spatial_checker_smoke.json";
import the_next_week from "./Examples/the_next_week.json";

const examples = {
  boing,
  colorchecker,
  cornell,
  cornell_with_smoke,
  dispersive,
  grey,
  one_weekend,
  scene,
  spatial_checker_smoke,
  the_next_week,
};
type examplesType = keyof typeof examples;
export const exampleNames = Object.keys(examples);

export type handleImportParams = {
  setMessage: (msg: string) => void;
  setSceneOptions: (scene: SceneOptions) => void;
  setCameraOptions: (camera: CameraOptions) => void;
  setSceneObjects: (sceneobjects: SceneObjects) => void;
  setMaterials: (materials: Materials) => void;
};

export const handleImport = ({
  setMessage,
  setSceneOptions,
  setCameraOptions,
  setSceneObjects,
  setMaterials,
}: handleImportParams) => {
  // TODO: this is extremely hacky, fix later, possibly with https://caniuse.com/native-filesystem-api
  const reader = new FileReader();
  const importElement: any = document.getElementById("importFileInput");
  const importFile = importElement.files[0];
  if (importFile) {
    reader.readAsText(importFile);
    reader.addEventListener("load", (event) => {
      const data: any = event?.target?.result;
      try {
        const json = JSON.parse(data);
        const { time_0, time_1, background_color, camera, objects, materials } =
          json;
        setSceneOptions({ time_0, time_1, background_color });
        setCameraOptions(camera);
        setSceneObjects(objects);
        setMaterials(materials);
      } catch (e) {
        setMessage(`cannot import; could not parse scene file: ${e}`);
        return;
      }
    });
  } else {
    setMessage("cannot import; file is null");
    return;
  }
  setMessage("scene file imported");
};

export const handleExport = (scene_file: any) => {
  // TODO: https://caniuse.com/native-filesystem-api
  const stringified = JSON.stringify(scene_file);
  const blob = new Blob([stringified], { type: "text/json" });
  const downloadLink = document.createElement("a");
  downloadLink.download = `scene-${new Date().toISOString()}.json`;
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.click();
};

export const collectFile = ({
  renderOptions,
  sceneOptions,
  cameraOptions,
  sceneObjects,
  materials,
}: {
  renderOptions: RenderOptions;
  sceneOptions: SceneOptions;
  cameraOptions: CameraOptions;
  sceneObjects: SceneObjects;
  materials: Materials;
}): any => {
  const opts = renderOptions;
  const { time_0, time_1, background_color } = sceneOptions;
  const scene_file = {
    time_0,
    time_1,
    background_color,
    camera: cameraOptions,
    objects: sceneObjects,
    materials: materials,
  };
  return {
    opts,
    scene_file,
  };
};

export const loadExample = ({
  setMessage,
  setSceneOptions,
  setCameraOptions,
  setSceneObjects,
  setMaterials,
}: handleImportParams) => {
  try {
    const importElement: any = document.getElementById("exampleSelect");
    const name = importElement.value as examplesType;
    const { time_0, time_1, camera, objects, materials } = examples[name];
    // FIXME: is there a better way to convince TS this is [number,number,number] and not number[] ?
    const background_color: [number, number, number] = [
      examples[name].background_color[0],
      examples[name].background_color[1],
      examples[name].background_color[2],
    ];
    setSceneOptions({ time_0, time_1, background_color });
    setCameraOptions(camera as CameraOptions);
    setSceneObjects(objects as SceneObjects);
    setMaterials(materials as Materials);
  } catch (e) {
    setMessage(`cannot load; could not parse example file: ${e}`);
    return;
  }
};
