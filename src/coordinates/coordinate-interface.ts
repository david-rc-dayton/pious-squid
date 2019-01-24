import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";

export interface IStateVector {
  /** Satellite state epoch. */
  epoch: EpochUTC;
  /** Position vector, in kilometers. */
  position: Vector3D;
  /** Velocity vector, in kilometers per second. */
  velocity: Vector3D;
}
