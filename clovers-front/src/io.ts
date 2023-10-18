import { implicitSceneSettings, SceneObjects } from "./Forms/Scene";
import { CameraOptions } from "./Forms/Camera";
import { RenderOptions } from "./Forms/RenderOptions";
import { SceneObject } from "./Objects/SceneObject";
import { Materials } from "./Materials/Material";

import cornell from "./Examples/cornell.json";
import dispersive from "./Examples/dispersive.json";
const examples = {
  cornell,
  dispersive,
};
type examplesType = keyof typeof examples;
export const exampleNames = Object.keys(examples);

export type handleImportParams = {
  setMessage: (msg: string) => void;
  setCameraOptions: (camera: CameraOptions) => void;
  setSceneObjects: (sceneobjects: SceneObjects) => void;
  setMaterials: (materials: Materials) => void;
};

export const handleImport = ({
  setMessage,
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
        const {
          // Ignoring a couple of fields for now that are handled in implicit / hidden settings.
          // time_0,
          // time_1,
          // background_color,
          camera,
          objects,
          materials,
          // priority_objects, // TODO: handle import for priority objects
        } = json;
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

// TODO: proper return type
export const handleExport = (scene_file: any) => {
  // TODO: https://caniuse.com/native-filesystem-api
  const stringified = JSON.stringify(scene_file);
  const blob = new Blob([stringified], { type: "text/json" });
  const downloadLink = document.createElement("a");
  downloadLink.download = `scene-${new Date().toISOString()}.json`;
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.click();
};

// TODO: proper return type
export const collectFile = ({
  renderOptions,
  cameraOptions,
  sceneObjects,
  materials,
}: {
  renderOptions: RenderOptions;
  cameraOptions: CameraOptions;
  sceneObjects: SceneObjects;
  materials: Materials;
}): any => {
  const opts = renderOptions;
  const scene_file = {
    ...implicitSceneSettings,
    camera: cameraOptions,
    objects: sceneObjects,
    priority_objects: sceneObjects.filter((obj: SceneObject) => obj.priority),
    materials: materials,
  };
  return {
    opts,
    scene_file,
  };
};

export const loadExample = ({
  setMessage,
  setCameraOptions,
  setSceneObjects,
  setMaterials,
}: handleImportParams) => {
  try {
    const importElement: any = document.getElementById("exampleSelect");
    const name = importElement.value as examplesType;
    const {
      // Ignoring a couple of fields for now that are handled in implicit / hidden settings.
      // time_0,
      // time_1,
      // background_color,
      camera,
      objects,
      materials,
      // priority_objects, // TODO: handle import for priority objects
    } = examples[name];
    setCameraOptions(camera as CameraOptions);
    setSceneObjects(objects as SceneObjects);
    setMaterials(materials as Materials);
  } catch (e) {
    setMessage(`cannot load; could not parse example file: ${e}`);
    return;
  }
};
