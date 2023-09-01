import { REACT_APP_BACKEND } from "./config";
import "./Preview.scss";

export const Preview = ({ previewId }: { previewId: string | undefined }) => {
  const imageUri = `${REACT_APP_BACKEND}/preview/${previewId}`;

  if (!previewId) {
    return (
      <figure className="Preview">
        <p>Click `preview` to begin</p>
      </figure>
    );
  }
  return (
    <figure className="Preview">
      <img src={imageUri}></img>
    </figure>
  );
};
