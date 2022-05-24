import { ReactElement } from "react";

export type Boxy = any;
export type ConstantMedium = any;
export type FlipFace = any;
export type MovingSphere = any;
export type Quad = {
  comment?: string;
  q: [number, number, number];
  u: [number, number, number];
  v: [number, number, number];
  material: any;
};
export type Rotate = any;
export type Sphere = any;
export type STL = any;
export type Translate = any;
export type Triangle = any;

export type SceneObject =
  | Boxy
  | ConstantMedium
  | FlipFace
  | MovingSphere
  | Quad
  | Rotate
  | Sphere
  | STL
  | Translate
  | Triangle;

const QuadForm = ({ quad }: { quad: Quad }): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>quad</h3>

      <label htmlFor="comment">comment: </label>
      <input id="comment" type="text" value={quad.comment} />

      <label htmlFor="q">q: </label>
      <div className="TripleInput">
        <input id="q_x" type="text" value={quad.q[0]} />
        <input id="q_y" type="text" value={quad.q[1]} />
        <input id="q_z" type="text" value={quad.q[2]} />
      </div>
      <label htmlFor="u">u: </label>
      <div className="TripleInput">
        <input id="u_x" type="text" value={quad.u[0]} />
        <input id="u_y" type="text" value={quad.u[1]} />
        <input id="u_z" type="text" value={quad.u[2]} />
      </div>
      <label htmlFor="v">v: </label>
      <div className="TripleInput">
        <input id="v_x" type="text" value={quad.v[0]} />
        <input id="v_y" type="text" value={quad.v[1]} />
        <input id="v_z" type="text" value={quad.v[2]} />
      </div>
      {/* <label htmlFor="example">example: </label>
      <div className="TripleInput">
        <input id="example_x" type="text" value={quad.example[0]} />
        <input id="example_y" type="text" value={quad.example[1]} />
        <input id="example_z" type="text" value={quad.example[2]} />
      </div> */}

      <label htmlFor="material">material: </label>
      <input id="material" type="text" value={JSON.stringify(quad.material)} />
    </div>
  );
};

const DebugForm = ({ object }: { object: SceneObject }): ReactElement => {
  return (
    <div className="OptionsForm">
      <h3>other object</h3>
      <label htmlFor="json">json: </label>
      <input id="json" type="text" value={JSON.stringify(object)} />
    </div>
  );
};

export const ObjectForm = ({
  object,
}: {
  object: SceneObject;
}): ReactElement => {
  // TODO: can this be done better somehow?
  let kind = Object.keys(object)[0];
  switch (kind) {
    case "Quad":
      return <QuadForm quad={object[kind] as Quad} />;
    default:
      return <DebugForm object={object} />;
  }
};
