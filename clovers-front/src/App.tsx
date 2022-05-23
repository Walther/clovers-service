import React, { ReactElement, useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./Button";

const REACT_APP_BACKEND = process.env.REACT_APP_BACKEND;

const render_default_options = {
  width: 1024,
  height: 1024,
  samples: 10,
  max_depth: 100,
  gamma: 2.0,
  quiet: false,
  normalmap: false,
};

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
  const [renderopts, setRenderopts] = useState(
    JSON.stringify(render_default_options, null, 2)
  );
  const [scenefile, setScenefile] = useState("");
  const [queue, setQueue] = useState<Array<String>>([]);
  const [renders, setRenders] = useState<Array<String>>([]);
  const [message, setMessage] = useState<String | null>(null);

  useEffect(() => {
    refreshQueue();
    refreshRenders();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    let opts;
    let scene_file;

    // parse the json inputs
    try {
      opts = JSON.parse(renderopts);
      scene_file = JSON.parse(scenefile);
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
        <form onSubmit={handleSubmit}>
          <h2>render options</h2>
          <textarea
            value={renderopts}
            onChange={(e) => setRenderopts(e.target.value)}
            placeholder={`{"json": "paste your render options here"}`}
            className="json_input"
          />
          <h2>scene file</h2>
          <textarea
            value={scenefile}
            onChange={(e) => setScenefile(e.target.value)}
            placeholder={`{"json": "paste your scene file here"}`}
            className="json_input"
          />
          <button type="submit">render</button>
        </form>
        <h2>message</h2>
        {message && <MessageBox message={message} />}
        <h2>queue</h2>
        <Button handleClick={() => refreshQueue()} text="refresh queue" />
        <RenderQueue queue={queue} />
        <h2>renders</h2>
        <Button handleClick={() => refreshRenders()} text="refresh renders" />
        <RenderRenders renders={renders} />
      </main>
      <footer>
        <p>&copy; clovers 2022</p>
        <ThemeToggle />
      </footer>
    </div>
  );
}

export default App;
