import { useCallback, useEffect, useState } from "react";
import { REACT_APP_BACKEND } from "./App";
import "./Preview.scss";

export const Preview = ({ previewId }: { previewId: string | undefined }) => {
  const imageUri = `${REACT_APP_BACKEND}/preview/${previewId}`;
  const [time, updateTime] = useState<any>();
  const forceUpdate = useCallback(() => updateTime(Date.now()), []);

  // TODO: fix this polling hack for rendering the preview
  useEffect(() => {
    console.log("polling");
    const interval = setInterval(() => {
      forceUpdate();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!previewId) {
    return (
      <figure className="Preview">
        <p>Click `preview` to generate a preview</p>
      </figure>
    );
  }
  return (
    <figure className="Preview">
      <img src={imageUri} key={time}></img>
    </figure>
  );
};
