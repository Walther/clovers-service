import React, { ReactElement, useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./Button";
import {
  RenderOptions,
  RenderOptionsForm,
  defaultRenderOptions,
} from "./RenderOptions";
import { implicitSceneSettings, SceneForm } from "./SceneForm";
import { CameraForm, CameraOptions, defaultCameraOptions } from "./CameraForm";

const REACT_APP_BACKEND = process.env.REACT_APP_BACKEND;

const RenderQueue = ({ queue }: { queue: Array<String> }): ReactElement => {
  return (
    <ul>
      {queue.map((task_id: String, index) => (
        <li key={index}>{task_id}</li>
      ))}
    </ul>
  );
};

const RenderRenders = ({
  renders,
}: {
  renders: Array<String>;
}): ReactElement => {
  return (
    <ul>
      {renders.map((task_id: String, index) => (
        <li key={index}>
          <a href={`${REACT_APP_BACKEND}/render/${task_id}`}>{task_id}</a>
        </li>
      ))}
    </ul>
  );
};

const MessageBox = ({ message }: { message: String }): ReactElement => {
  return <p className="MessageBox">{message}</p>;
};

function App() {
  const [renderOptions, setRenderOptions] =
    useState<RenderOptions>(defaultRenderOptions);
  const [cameraOptions, setCameraOptions] =
    useState<CameraOptions>(defaultCameraOptions);
  const [scenefile, setScenefile] = useState("");
  const [queue, setQueue] = useState<Array<String>>([]);
  const [renders, setRenders] = useState<Array<String>>([]);
  const [message, setMessage] = useState<String>("Ready.");

  useEffect(() => {
    refreshQueue();
    refreshRenders();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Ready.");

    let opts;
    let scene_file;

    // parse the json inputs
    try {
      opts = renderOptions;
      scene_file = JSON.parse(scenefile);
      scene_file = {
        ...implicitSceneSettings,
        ...scene_file,
        camera: cameraOptions,
      };
    } catch (error: any) {
      setMessage(error.message);
      return;
    }

    try {
      const response = await axios.post(
        `${REACT_APP_BACKEND}/queue`,
        // body
        {
          opts,
          scene_file,
        },
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
      const response = await axios.get<Array<String>>(
        `${REACT_APP_BACKEND}/queue`
      );
      setQueue(response.data);
    } catch (error: any) {
      // TODO: AxiosError somehow?
      setMessage(error.response.data.error);
    }
  };

  const refreshRenders = async () => {
    try {
      const response = await axios.get<Array<String>>(
        `${REACT_APP_BACKEND}/render`
      );
      setRenders(response.data);
    } catch (error: any) {
      // TODO: AxiosError somehow?
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>clovers web frontend</h1>
      </header>
      <main>
        <RenderOptionsForm
          renderOptions={renderOptions}
          setRenderOptions={setRenderOptions}
        />
        <CameraForm
          cameraOptions={cameraOptions}
          setCameraOptions={setCameraOptions}
        />
        <SceneForm
          scenefile={scenefile}
          setScenefile={setScenefile}
          handleSubmit={handleSubmit}
        />
        <h2>message</h2>
        <MessageBox message={message} />
        <h2>queue</h2>
        <Button handleClick={() => refreshQueue()} text="refresh queue" />
        <RenderQueue queue={queue} />
        <h2>renders</h2>
        <Button handleClick={() => refreshRenders()} text="refresh renders" />
        <RenderRenders renders={renders} />
      </main>
      <footer>
        <p>
          &copy; clovers 2022 <ThemeToggle />
        </p>
      </footer>
    </div>
  );
}

export default App;
