import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { TextInput, NumberInput, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";

export type Sphere = {
  comment?: string;
  radius: number;
  center: [number, number, number];
  material: Material;
};

export const SphereForm = ({
  object,
  path,
  setState,
}: {
  object: Sphere;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  // removing the title from the path for deleting; TODO: remove when adding `kind` to objects and reducing nesting in upstream
  const deletePath = path.slice(0, -1);
  return (
    <div className="OptionsForm">
      <h3>sphere</h3>
      <DeleteButton path={deletePath} setState={setState} />
      <TextInput
        fieldname="comment"
        object={object}
        path={path}
        setState={setState}
      />
      <NumberInput
        fieldname="radius"
        object={object}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="center"
        object={object}
        path={path}
        setState={setState}
      />
      <MaterialForm
        material={object.material}
        path={[...path, "material"]}
        setState={setState}
      />
    </div>
  );
};
