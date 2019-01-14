import { Vector3D } from "../math/vector-3d";
import { J2000 } from "../coordinates/j2000";

/** Store acceration name and vector. */
export type AccelerationMap = {
  [name: string]: Vector3D;
};

export interface AccelerationForce {
  /** Update acceleration map with a named vector for this object. */
  acceleration: (j2kState: J2000, accMap: AccelerationMap) => void;
}
