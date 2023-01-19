import { ReactElement } from "react";
import { DeleteButton } from "../Inputs/DeleteButton";
import { NumberInput, TripleNumberInput } from "../Inputs/Number";

export type SpatialChecker = {
  kind: "SpatialChecker";
  even: [number, number, number];
  odd: [number, number, number];
  density: number;
};

export const SpatialCheckerForm = ({
  texture,
  path,
  setState,
}: {
  texture: SpatialChecker;
  path: R.Path;
  setState: React.Dispatch<React.SetStateAction<SpatialChecker>>;
}): ReactElement => {
  const mat = "SpatialChecker";
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
