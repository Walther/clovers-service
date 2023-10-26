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
  ObjectsForm,
  SceneObjects,
} from "./Forms/ObjectsForm";
import {
  CameraForm,
  CameraOptions,
  defaultCameraOptions,
} from "./Forms/Camera";
import { NewObjectForm } from "./Objects/SceneObject";
import { ActionForm } from "./Forms/Actions";
import { Preview } from "./Preview";
import { REACT_APP_BACKEND, WS_ENDPOINT } from "./config";
import useWebSocket from "react-use-websocket";
import { collectFile, handleImport, handleExport, loadExample } from "./io";
import { RenderResults } from "./RenderResults";
import {
  Materials,
  MaterialsForm,
  NewMaterialForm,
  defaultMaterials,
} from "./Materials/Material";

function App() {
  const [renderOptions, setRenderOptions] =
    useState<RenderOptions>(defaultRenderOptions);
  const [cameraOptions, setCameraOptions] =
    useState<CameraOptions>(defaultCameraOptions);
  const [sceneObjects, setSceneObjects] =
    useState<SceneObjects>(defaultSceneObjects);
  const [materials, setMaterials] = useState<Materials>(defaultMaterials);
  const [queue, setQueue] = useState<Array<string>>([]);
  const [renders, setRenders] = useState<Array<string>>([]);
  const [message, setMessage] = useState<string>("Ready.");
  const [previewId, setPreviewId] = useState<string | undefined>();

  useEffect(() => {
    refreshQueue();
    refreshResults();
  }, []);

  const { sendJsonMessage } = useWebSocket(WS_ENDPOINT, {
    onOpen: (_event) => {
      console.log("WebSocket connection opened");
      setMessage("Ready.");
    },
    onMessage: (event) => {
      console.log("WebSocket message from server ", event.data);
      const json = JSON.parse(event.data);
      switch (json.kind) {
        case "preview":
          setPreviewId(json.body);
          break;
        case "refreshQueue":
          refreshQueue();
          break;
        case "refreshResults":
          refreshResults();
          break;
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

  const nobackend = () => {
    console.error("REACT_APP_BACKEND not defined");
    setMessage("not connected to a backend. rendering not available.");
  };

  const handlePreview = async () => {
    const body = collectFile({
      renderOptions,
      cameraOptions,
      sceneObjects,
      materials,
    });
    const data = {
      kind: "preview",
      body,
    };

    try {
      if (!REACT_APP_BACKEND) {
        nobackend();
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
    const body = collectFile({
      renderOptions,
      cameraOptions,
      sceneObjects,
      materials,
    });

    try {
      if (!REACT_APP_BACKEND) {
        nobackend();
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
      setMessage(error.response.data);
    }
  };

  const refreshQueue = async () => {
    try {
      if (!REACT_APP_BACKEND) {
        nobackend();
        return;
      }
      const response = await axios.get<Array<string>>(
        `${REACT_APP_BACKEND}/queue`
      );
      setQueue(response.data);
    } catch (error: any) {
      setMessage(error?.response?.data?.error);
    }
  };

  const refreshResults = async () => {
    refreshQueue();
    try {
      if (!REACT_APP_BACKEND) {
        nobackend();
        return;
      }
      const response = await axios.get<Array<string>>(
        `${REACT_APP_BACKEND}/render`
      );
      setRenders(response.data);
    } catch (error: any) {
      setMessage(error?.response?.data?.error);
    }
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
          <h2>actions & options</h2>
          <MessageBox message={message} />
          <div className="OptionsGroup">
            <ActionForm
              handlePreview={handlePreview}
              handleRender={handleRender}
              handleImport={() =>
                handleImport({
                  setMessage,
                  setCameraOptions,
                  setSceneObjects,
                  setMaterials,
                })
              }
              handleExport={() => {
                const { scene_file } = collectFile({
                  renderOptions,
                  cameraOptions,
                  sceneObjects,
                  materials,
                });
                handleExport(scene_file);
              }}
              handleExample={() =>
                loadExample({
                  setMessage,
                  setCameraOptions,
                  setSceneObjects,
                  setMaterials,
                })
              }
            />
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
        </div>
        <div className="RightGroup">
          <div>
            <h2>objects</h2>
            <NewObjectForm setState={setSceneObjects} path={[]} />
            <ObjectsForm
              sceneObjects={sceneObjects}
              setSceneObjects={setSceneObjects}
            />
          </div>
          <div>
            <h2>materials</h2>
            <NewMaterialForm setState={setMaterials} path={[]} />
            <MaterialsForm materials={materials} setMaterials={setMaterials} />
          </div>
          <div>
            <h2>results</h2>
            <div className="ResultBox">
              <Button
                handleClick={() => refreshResults()}
                text="refresh renders"
              />
              queue length: {queue.length}
              <RenderResults renders={renders} />
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; clovers 2023</p>
      </footer>
    </div>
  );
}

export default App;
