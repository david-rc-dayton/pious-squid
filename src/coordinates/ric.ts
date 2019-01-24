import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";

/** Class representing Radial-Intrack-Crosstrack (RIC) relative coordinates. */
export class RIC {
  /** State UTC Epoch. */
  public readonly epoch: EpochUTC;

  /** Relative position, in kilometers. */
  public readonly position: Vector3D;

  /** Relative velocity, in kilometers per second. */
  public readonly velocity: Vector3D;

  /**
   * Create a new RIC object.
   *
   * @param epoch UTC epoch
   * @param position relative position, in kilometers
   * @param velocity relative velocity, in kilometers per second
   */
  constructor(epoch: EpochUTC, position: Vector3D, velocity: Vector3D) {
    this.epoch = epoch;
    this.position = position;
    this.velocity = velocity;
  }

  /** Return a string representation of this object. */
  public toString(): string {
    const { epoch, position, velocity } = this;
    const output = [
      "[RIC]",
      `  Epoch:  ${epoch.toString()}`,
      `  Position:  ${position.toString()} km`,
      `  Velocity:  ${velocity.toString()} km/s`
    ];
    return output.join("\n");
  }
}
