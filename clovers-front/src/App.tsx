import { ReactElement, useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";
import { ThemeToggle } from "./Inputs/ThemeToggle";
import { Button } from "./Inputs/Button";
import {
  RenderOptions,
  RenderOptionsForm,
  defaultRenderOptions,
} from "./Forms/RenderOptions";
import {
  defaultSceneObjects,
  implicitSceneSettings,
  SceneForm,
  SceneObjects,
} from "./Forms/Scene";
import {
  CameraForm,
  CameraOptions,
  defaultCameraOptions,
} from "./Forms/Camera";
import { NewObjectForm, SceneObject } from "./Objects/SceneObject";
import { ActionForm } from "./Forms/Actions";
import { Preview } from "./Preview";
import { REACT_APP_BACKEND, WS_ENDPOINT } from "./config";
import useWebSocket from "react-use-websocket";

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

const RenderResults = ({
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
  const [previewId, setPreviewId] = useState<string | undefined>();

  useEffect(() => {
    refreshQueue();
    refreshRenders();
  }, []);

  const { sendJsonMessage } = useWebSocket(WS_ENDPOINT, {
    onOpen: (_event) => {
      console.log("WebSocket connection opened");
      setMessage("Ready.");
    },
    onMessage: (event) => {
      console.log("WebSocket message from server ", event.data);
      const json = JSON.parse(event.data);
      if (json.kind === "preview") {
        setPreviewId(json.body);
      }
    },
    onError: (event) => {
      console.log("WebSocket error from server ", event);
      setMessage("WebSocket connection closed. Please reload the page");
    },
    onClose: (_event) => console.log("WebSocket connection closed"),
    shouldReconnect: (closeEvent) => {
      console.log("WebSocket closeEvent ", closeEvent);
      return true;
    },
  });

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

  const handlePreview = async () => {
    const body = collectFile();
    const data = {
      kind: "preview",
      body,
    };

    try {
      if (!REACT_APP_BACKEND) {
        // TODO: better handling...
        console.error("REACT_APP_BACKEND not defined");
        setMessage("not connected to a backend. rendering not available.");
        return;
      }
      sendJsonMessage(data);
      console.log("sent preview task");
    } catch (error: any) {
      setMessage(error.toString());
    }
  };

  const handleRender = async () => {
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

  const MessageBox = ({ message }: { message: string }): ReactElement => {
    return <p className="MessageBox">{message}</p>;
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
        <div className="LeftGroup">
          <Preview previewId={previewId} />
        </div>
        <div className="MiddleGroup">
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
            <ActionForm
              handlePreview={handlePreview}
              handleRender={handleRender}
              handleImport={handleImport}
              handleExport={handleExport}
            />
            <NewObjectForm setState={setSceneObjects} path={[]} />
          </div>
          <SceneForm
            sceneObjects={sceneObjects}
            setSceneObjects={setSceneObjects}
          />
        </div>
        <div className="RightGroup">
          <h2>status</h2>
          <MessageBox message={message} />
          <h2>queue</h2>
          <Button handleClick={() => refreshQueue()} text="refresh queue" />
          <RenderQueue queue={queue} />
          <h2>renders</h2>
          <Button handleClick={() => refreshRenders()} text="refresh renders" />
          <RenderResults renders={renders} />
        </div>
      </main>
      <footer>
        <p>&copy; clovers 2023</p>
      </footer>
    </div>
  );
}

export default App;
