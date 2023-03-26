import { ReactElement } from "react";

export const RenderQueue = ({
  queue,
}: {
  queue: Array<string>;
}): ReactElement => {
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
