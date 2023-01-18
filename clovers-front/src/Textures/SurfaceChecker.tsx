import { ReactElement } from "react";
import { DeleteButton } from "../DeleteButton";
import { NumberInput, TripleNumberInput } from "../Input";

export type SurfaceChecker = {
  kind: "SurfaceChecker";
  even: [number, number, number];
  odd: [number, number, number];
  density: number;
};
export const SurfaceCheckerForm = ({
  texture,
  path,
  setState,
}: {
  texture: SurfaceChecker;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<SurfaceChecker>>;
}): ReactElement => {
  const mat = "SurfaceChecker";
  return (
    <div className="OptionsForm">
      <h3>{mat}</h3>
      <DeleteButton path={path} setState={setState} />
      <NumberInput
        fieldname="density"
        object={texture}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="even"
        object={texture}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        fieldname="odd"
        object={texture}
        path={path}
        setState={setState}
      />
    </div>
  );
};
