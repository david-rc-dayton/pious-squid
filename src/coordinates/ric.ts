import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";
import { IStateVector } from "./coordinate-interface";
import { J2000 } from "./j2000";
import { Matrix3D } from "../math/matrix-3d";

/** Class representing Radial-Intrack-Crosstrack (RIC) relative coordinates. */
export class RIC implements IStateVector {
  /** State UTC Epoch. */
  public readonly epoch: EpochUTC;
  /** Relative position vector, in kilometers. */
  public readonly position: Vector3D;
  /** Relative velocity vector, in kilometers per second. */
  public readonly velocity: Vector3D;

  private reference: J2000 | null;
  private matrix: Matrix3D | null;

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
    this.reference = null;
    this.matrix = null;
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

  public static fromJ2kState(state: J2000, reference: J2000) {
    const ru = state.position.normalized();
    const cu = state.position.cross(state.velocity).normalized();
    const iu = cu.cross(ru);
    const matrix = new Matrix3D(ru, iu, cu);

    const dp = state.position.add(reference.position.negate());
    const dv = state.velocity.add(reference.velocity.negate());
    const ric = new RIC(
      state.epoch,
      matrix.multiplyVector3D(dp),
      matrix.multiplyVector3D(dv)
    );
    ric.reference = reference;
    ric.matrix = matrix;
    return ric;
  }

  public toJ2000() {
    this.matrix = this.matrix || Matrix3D.zeroes();
    this.reference =
      this.reference ||
      new J2000(this.epoch, Vector3D.origin(), Vector3D.origin());
    const ricMatrixT = this.matrix.transpose();
    const dp = ricMatrixT.multiplyVector3D(this.position);
    const dv = ricMatrixT.multiplyVector3D(this.velocity);
    return new J2000(
      this.epoch,
      this.reference.position.add(dp),
      this.reference.velocity.add(dv)
    );
  }

  public addVelocity(radial: number, intrack: number, crosstrack: number) {
    const deltaV = new Vector3D(radial, intrack, crosstrack);
    const ric = new RIC(this.epoch, this.position, this.velocity.add(deltaV));
    ric.reference = this.reference;
    ric.matrix = this.matrix;
    return ric;
  }
}
