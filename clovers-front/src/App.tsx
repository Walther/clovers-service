import React, { ReactElement, useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./Button";
import {
  RenderOptions,
  RenderOptionsForm,
  defaultRenderOptions,
} from "./RenderOptionsForm";
import {
  defaultSceneObjects,
  implicitSceneSettings,
  SceneForm,
  SceneObjects,
} from "./SceneForm";
import { CameraForm, CameraOptions, defaultCameraOptions } from "./CameraForm";
import { FileInput } from "./Input";
import { SceneObject } from "./Objects/SceneObject";

const REACT_APP_BACKEND = process.env.REACT_APP_BACKEND;

const RenderQueue = ({ queue }: { queue: Array<string> }): ReactElement => {
  if (!queue) {
    return <p>render queue not available</p>;
  }
  return (
    <ul>
      {queue.map((task_id: string, index) => (
        <li key={index}>{task_id}</li>
      ))}
    </ul>
  );
};

const RenderRenders = ({
  renders,
}: {
  renders: Array<string>;
}): ReactElement => {
  if (!renders) {
    return <p>render results not available</p>;
  }

  return (
    <div className="RenderResults">
      <ul>
        {renders.map((task_id: string, index) => (
          <li key={index}>
            <a
              href={`${REACT_APP_BACKEND}/render/${task_id}`}
              target="_blank"
              rel="noreferrer"
            >
              {task_id}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MessageBox = ({ message }: { message: string }): ReactElement => {
  return <p className="MessageBox">{message}</p>;
};

function App() {
  const [renderOptions, setRenderOptions] =
    useState<RenderOptions>(defaultRenderOptions);
  const [cameraOptions, setCameraOptions] =
    useState<CameraOptions>(defaultCameraOptions);
  const [sceneObjects, setSceneObjects] =
    useState<SceneObjects>(defaultSceneObjects);
  const [queue, setQueue] = useState<Array<string>>([]);
  const [renders, setRenders] = useState<Array<string>>([]);
  const [message, setMessage] = useState<string>("Ready.");

  useEffect(() => {
    refreshQueue();
    refreshRenders();
  }, []);

  const collectFile = () => {
    const opts = renderOptions;
    const scene_file = {
      ...implicitSceneSettings,
      camera: cameraOptions,
      objects: sceneObjects,
      priority_objects: sceneObjects.filter((obj: SceneObject) => obj.priority),
    };
    return {
      opts,
      scene_file,
    };
  };

  const handleSubmit = async () => {
    setMessage("Ready.");
    const body = collectFile();

    try {
      if (!REACT_APP_BACKEND) {
        // TODO: better handling...
        console.error("REACT_APP_BACKEND not defined");
        setMessage("not connected to a backend. rendering not available.");
        return;
      }
      const response = await axios.post(
        `${REACT_APP_BACKEND}/queue`,
        // body
        body,
        // config
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const id = response.data;
      setMessage(`Queued a new render task: ${id}`);
      refreshQueue();
    } catch (error: any) {
      // TODO: AxiosError somehow?
      setMessage(error.response.data);
    }
  };

  const refreshQueue = async () => {
    try {
      if (!REACT_APP_BACKEND) {
        // TODO: better handling...
        console.error("REACT_APP_BACKEND not defined");
        return;
      }
      const response = await axios.get<Array<string>>(
        `${REACT_APP_BACKEND}/queue`
      );
      setQueue(response.data);
    } catch (error: any) {
      // TODO: AxiosError somehow?
      setMessage(error?.response?.data?.error);
    }
  };

  const refreshRenders = async () => {
    try {
      if (!REACT_APP_BACKEND) {
        // TODO: better handling...
        console.error("REACT_APP_BACKEND not defined");
        return;
      }
      const response = await axios.get<Array<string>>(
        `${REACT_APP_BACKEND}/render`
      );
      setRenders(response.data);
    } catch (error: any) {
      // TODO: AxiosError somehow?
      setMessage(error?.response?.data?.error);
    }
  };

  const handleImport = () => {
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
            // priority_objects, // TODO: handle import for priority objects
          } = json;
          setCameraOptions(camera);
          setSceneObjects(objects);
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

  const handleExport = () => {
    // TODO: https://caniuse.com/native-filesystem-api
    const { scene_file } = collectFile();
    const stringified = JSON.stringify(scene_file);
    const blob = new Blob([stringified], { type: "text/json" });
    const downloadLink = document.createElement("a");
    downloadLink.download = `scene-${new Date().toISOString()}.json`;
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.click();
  };

  return (
    <div className="App">
      <header>
        <h1>clovers web frontend</h1>
        <ThemeToggle />
        {REACT_APP_BACKEND === undefined && (
          <h2>error: not connected to a backend. rendering not available.</h2>
        )}
      </header>
      <main>
        <h2>options</h2>
        <div className="OptionsGroup">
          <RenderOptionsForm
            object={renderOptions}
            setState={setRenderOptions}
            path={[]}
          />
          <CameraForm
            object={cameraOptions}
            setState={setCameraOptions}
            path={[]}
          />
        </div>
        <SceneForm
          sceneObjects={sceneObjects}
          setSceneObjects={setSceneObjects}
        />
        <h2>actions</h2>
        <div className="actionsMenu">
          <Button handleClick={() => handleSubmit()} text="render" />
          <Button handleClick={() => handleExport()} text="export" />
          <Button handleClick={() => handleImport()} text="import" />
          <FileInput id="importFileInput" />
        </div>
        <MessageBox message={message} />
        <h2>queue</h2>
        <Button handleClick={() => refreshQueue()} text="refresh queue" />
        <RenderQueue queue={queue} />
        <h2>renders</h2>
        <Button handleClick={() => refreshRenders()} text="refresh renders" />
        <RenderRenders renders={renders} />
      </main>
      <footer>
        <p>&copy; clovers 2022</p>
      </footer>
    </div>
  );
}

export default App;
