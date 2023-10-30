import { ReactElement } from "react";
import { REACT_APP_BACKEND } from "./config";

export const RenderResults = ({
  renders,
}: {
  renders: Array<string>;
}): ReactElement => {
  if (!renders) {
    return <p>render results not available</p>;
  }

  return (
    <div className="RenderResults">
      {renders.map((task_id: string, index) => (
        <div key={index}>
          <a
            href={`${REACT_APP_BACKEND}/render/${task_id}`}
            target="_blank"
            rel="noreferrer"
          >
            <figure>
              <img
                src={`${REACT_APP_BACKEND}/thumb/${task_id}`}
                alt={`thumbnail for image ${task_id}`}
              />
            </figure>
          </a>
        </div>
      ))}
    </div>
  );
};
