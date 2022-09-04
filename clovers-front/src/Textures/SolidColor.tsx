import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { TripleNumberInput } from "../Input";

export type SolidColor = {
  color: [number, number, number];
};
export const SolidColorForm = ({
  texture,
  path,
  setState,
}: {
  texture: SolidColor;
  path: any; // TODO: ramda path type
  setState: any;
}): ReactElement => {
  const mat = "SolidColor";
  return (
    <div className="OptionsForm">
      <h3>{mat}</h3>
      <DeleteButton path={path} setState={setState} />
      <TripleNumberInput
        fieldname="color"
        object={texture}
        path={path}
        setState={setState}
      />
    </div>
  );
};
