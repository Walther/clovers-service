import { ReactElement, useId } from "react";
import { DeleteButton } from "../DeleteButton";
import { Texture, TextureForm } from "../Textures/Texture";

export type DiffuseLight = {
  emit: Texture;
};

export const DiffuseLightForm = ({
  material,
  path,
  setState,
}: {
  material: DiffuseLight;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  const id = useId();
  const mat = "DiffuseLight";
  // removing the title from the path for deleting; TODO: remove when adding `kind` to objects and reducing nesting in upstream
  const deletePath = path.slice(0, -1);
  return (
    <div className="OptionsForm">
      <h3>material</h3>
      <DeleteButton path={deletePath} setState={setState} />
      <label htmlFor={id}>type: </label>
      <select id={id}>
        <option>{mat}</option>
      </select>
      <TextureForm
        texture={material.emit}
        path={[...path, "emit"]}
        setState={setState}
      />
    </div>
  );
};
