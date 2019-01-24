import { Vector3D } from "../math/vector-3d";

/** Class representing Radial-Intrack-Crosstrack (RIC) relative coordinates. */
export class RIC {
  /** Relative position, in kilometers. */
  public readonly relPosition: Vector3D;

  /** Relative velocity, in kilometers per second. */
  public readonly relVelocity: Vector3D;

  /**
   * Create a new RIC object.
   *
   * @param epoch UTC epoch
   * @param relPosition relative position, in kilometers
   * @param relVelocity relative velocity, in kilometers per second
   */
  constructor(relPosition: Vector3D, relVelocity: Vector3D) {
    this.relPosition = relPosition;
    this.relVelocity = relVelocity;
  }

  /** Return a string representation of this object. */
  public toString(): string {
    const { relPosition, relVelocity } = this;
    const output = [
      "[RIC]",
      `  Position:  ${relPosition.toString()} km`,
      `  Velocity:  ${relVelocity.toString()} km/s`
    ];
    return output.join("\n");
  }
}
