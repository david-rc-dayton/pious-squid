import { Vector3D } from "../math/vector-3d";
import { J2000 } from "../coordinates/j2000";

export type AccelerationMap = {
  [name: string]: Vector3D;
};

export interface AccelerationForce {
  acceleration: (j2kState: J2000, accMap: AccelerationMap) => void;
}
