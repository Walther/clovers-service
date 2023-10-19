import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { NumberInput, TripleNumberInput } from "../Inputs/Number";

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
        tooltip="density of the surface checker"
        fieldname="density"
        object={texture}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        tooltip="sRGB float, even squares"
        fieldname="even"
        object={texture}
        path={path}
        setState={setState}
      />
      <TripleNumberInput
        tooltip="sRGB float, odd squares"
        fieldname="odd"
        object={texture}
        path={path}
        setState={setState}
      />
    </div>
  );
};
