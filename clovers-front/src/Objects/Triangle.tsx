import { ReactElement } from "react";
import { Input, TripleInput } from "../Input";
import { Material } from "../Material";

export type Triangle = {
  comment?: string;
  q: [number, number, number];
  u: [number, number, number];
  v: [number, number, number];
  material: Material;
};

export const TriangleForm = ({
  object,
}: {
  object: Triangle;
}): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>triangle</h3>
      <Input fieldname="comment" object={object} />
      <TripleInput fieldname="q" object={object} />
      <TripleInput fieldname="u" object={object} />
      <TripleInput fieldname="v" object={object} />
      <Input fieldname="material" object={object} stringify={true} />
    </div>
  );
};
