import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { TripleNumberInput } from "../Inputs/NumberInput";

export type SolidColor = {
  kind: "SolidColor";
  color: [number, number, number];
};
export const SolidColorForm = ({
  texture,
  path,
  setState,
}: {
  texture: SolidColor;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<SolidColor>>;
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
