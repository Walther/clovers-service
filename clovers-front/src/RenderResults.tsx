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
