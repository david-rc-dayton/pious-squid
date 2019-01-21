import { EarthBody } from "../bodies/earth-body";
import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";
import { J2000 } from "./j2000";

/** Class representing True Equator Mean Equinox (TEME) coordinates. */
export class TEME {
  /** Satellite state epoch. */
  public readonly epoch: EpochUTC;
  /** Position 3-vector, in kilometers. */
  public readonly position: Vector3D;
  /** Velocity 3-vector, in kilometers per second. */
  public readonly velocity: Vector3D;

  /**
   * Create a new TEME object.
   *
   * @param epoch UTC epoch
   * @param position J2000 position, in kilometers
   * @param velocity J2000 velocity, in kilometers per second
   */
  constructor(epoch: EpochUTC, position: Vector3D, velocity: Vector3D) {
    this.epoch = epoch;
    this.position = position;
    this.velocity = velocity || Vector3D.origin();
  }

  /** Return a string representation of this object. */
  public toString(): string {
    const { epoch, position, velocity } = this;
    const output = [
      "[TEME]",
      `  Epoch:  ${epoch.toString()}`,
      `  Position:  ${position.toString()} km`,
      `  Velocity:  ${velocity.toString()} km/s`
    ];
    return output.join("\n");
  }

  /** Convert this to a TEME state vector object. */
  public toJ2000() {
    const { epoch, position, velocity } = this;
    const [dPsi, dEps, mEps] = EarthBody.nutation(epoch);
    const epsilon = mEps + dEps;
    const rMOD = position
      .rot3(-dPsi * Math.cos(epsilon))
      .rot1(epsilon)
      .rot3(dPsi)
      .rot1(-mEps);
    const vMOD = velocity
      .rot3(-dPsi * Math.cos(epsilon))
      .rot1(epsilon)
      .rot3(dPsi)
      .rot1(-mEps);
    const [zeta, theta, zed] = EarthBody.precession(epoch);
    const rJ2K = rMOD
      .rot3(zed)
      .rot2(-theta)
      .rot3(zeta);
    const vJ2K = vMOD
      .rot3(zed)
      .rot2(-theta)
      .rot3(zeta);
    return new J2000(this.epoch, rJ2K, vJ2K);
  }
}
