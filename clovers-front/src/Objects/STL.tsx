import { ReactElement } from "react";
import { Input, TripleNumberInput } from "../Input";
import { Material, MaterialForm } from "../Materials/Material";

export type STL = {
  comment?: string;
  path: string;
  scale: number;
  center: [number, number, number];
  rotation: [number, number, number];
  material: Material;
};

export const STLForm = ({
  object,
  path,
  setState,
}: {
  object: STL;
  path: any; // TODO: ramda path type
  setState: Function;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>stl</h3>
      <Input
        fieldname="comment"
        object={object}
        path={[...path, "comment"]}
        setState={setState}
      />
      <Input
        fieldname="path"
        object={object}
        path={[...path, "path"]}
        setState={setState}
      />
      <Input
        fieldname="scale"
        object={object}
        path={[...path, "scale"]}
        setState={setState}
      />
      <TripleNumberInput fieldname="center" object={object} />
      <TripleNumberInput fieldname="rotation" object={object} />
      <MaterialForm
        material={object.material}
        path={[...path, "material"]}
        setState={setState}
      />
    </div>
  );
};
