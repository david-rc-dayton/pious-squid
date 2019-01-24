import { EarthBody } from "../bodies/earth-body";
import { DataHandler } from "../data/data-handler";
import { TWO_PI } from "../math/constants";
import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";
import { ClassicalElements } from "./classical-elements";
import { IStateVector } from "./coordinate-interface";
import { ITRF } from "./itrf";
import { RIC } from "./ric";
import { TEME } from "./teme";

/** Class representing J2000 (J2K) inertial coordinates. */
export class J2000 implements IStateVector {
  /** Satellite state epoch. */
  public readonly epoch: EpochUTC;
  /** Position vector, in kilometers. */
  public readonly position: Vector3D;
  /** Velocity vector, in kilometers per second. */
  public readonly velocity: Vector3D;

  /**
   * Create a new J2000 object.
   *
   * @param epoch UTC epoch
   * @param position J2000 position, in kilometers
   * @param velocity J2000 velocity, in kilometers per second
   */
  constructor(epoch: EpochUTC, position: Vector3D, velocity?: Vector3D) {
    this.epoch = epoch;
    this.position = position;
    this.velocity = velocity || Vector3D.origin();
  }

  /** Return a string representation of this object. */
  public toString(): string {
    const { epoch, position, velocity } = this;
    const output = [
      "[J2000]",
      `  Epoch:  ${epoch.toString()}`,
      `  Position:  ${position.toString()} km`,
      `  Velocity:  ${velocity.toString()} km/s`
    ];
    return output.join("\n");
  }

  /** Calculate this orbit's mechanical energy, in km^2/s^2 */
  private mechanicalEnergy() {
    const r = this.position.magnitude();
    const v = this.velocity.magnitude();
    return (v * v) / 2.0 - EarthBody.MU / r;
  }

  /** Convert to Classical Orbit Elements. */
  public toClassicalElements(): ClassicalElements {
    const { epoch, position: pos, velocity: vel } = this;
    var mu = EarthBody.MU;
    var energy = this.mechanicalEnergy();
    var a = -(mu / (2 * energy));
    var eVecA = pos.scale(Math.pow(vel.magnitude(), 2) - mu / pos.magnitude());
    var eVecB = vel.scale(pos.dot(vel));
    var eVec = eVecA.add(eVecB.negate()).scale(1.0 / mu);
    var e = eVec.magnitude();
    var h = pos.cross(vel);
    var i = Math.acos(h.z / h.magnitude());
    var n = new Vector3D(0, 0, 1).cross(h);
    var o = Math.acos(n.x / n.magnitude());
    if (n.y < 0) {
      o = TWO_PI - o;
    }
    var w = Math.acos(n.dot(eVec) / (n.magnitude() * eVec.magnitude()));
    if (eVec.z < 0) {
      w = TWO_PI - w;
    }
    var v = Math.acos(eVec.dot(pos) / (eVec.magnitude() * pos.magnitude()));
    if (pos.dot(vel) < 0) {
      v = TWO_PI - v;
    }
    return new ClassicalElements(epoch, a, e, i, o, w, v);
  }

  /** Convert this to a ITRF state vector object. */
  public toITRF() {
    const { epoch, position, velocity } = this;
    const prec = EarthBody.precession(epoch);
    const rMOD = position
      .rot3(-prec[0])
      .rot2(prec[1])
      .rot3(-prec[2]);
    const vMOD = velocity
      .rot3(-prec[0])
      .rot2(prec[1])
      .rot3(-prec[2]);
    const [dPsi, dEps, mEps] = EarthBody.nutation(epoch);
    const epsilon = mEps + dEps;
    const rTOD = rMOD
      .rot1(mEps)
      .rot3(-dPsi)
      .rot1(-epsilon);
    const vTOD = vMOD
      .rot1(mEps)
      .rot3(-dPsi)
      .rot1(-epsilon);
    const ast = epoch.gmstAngle() + dPsi * Math.cos(epsilon);
    const rPEF = rTOD.rot3(ast);
    const vPEF = vTOD.rot3(ast).add(
      EarthBody.getRotation(this.epoch)
        .negate()
        .cross(rPEF)
    );
    const { pmX, pmY } = DataHandler.getFinalsData(epoch.toMjd());
    const rITRF = rPEF.rot1(-pmY).rot2(-pmX);
    const vITRF = vPEF.rot1(-pmY).rot2(-pmX);
    return new ITRF(epoch, rITRF, vITRF);
  }

  /** Convert this to a TEME state vector object. */
  public toTEME() {
    const { epoch, position, velocity } = this;
    const [zeta, theta, zed] = EarthBody.precession(epoch);
    const rMOD = position
      .rot3(-zeta)
      .rot2(theta)
      .rot3(-zed);
    const vMOD = velocity
      .rot3(-zeta)
      .rot2(theta)
      .rot3(-zed);
    const [dPsi, dEps, mEps] = EarthBody.nutation(epoch);
    const epsilon = mEps + dEps;
    const rTEME = rMOD
      .rot1(mEps)
      .rot3(-dPsi)
      .rot1(-epsilon)
      .rot3(dPsi * Math.cos(epsilon));
    const vTEME = vMOD
      .rot1(mEps)
      .rot3(-dPsi)
      .rot1(-epsilon)
      .rot3(dPsi * Math.cos(epsilon));
    return new TEME(this.epoch, rTEME, vTEME);
  }

  /**
   * Convert this to a RIC relative motion object.
   *
   * @param reference target state for reference frame
   */
  public toRIC(reference: J2000) {
    return RIC.fromJ2kState(this, reference);
  }

  /**
   * Apply an instantaneous delta-V to this state.
   *
   * Returns a new state object.
   *
   * @param radial radial delta-V (km/s)
   * @param intrack intrack delta-V (km/s)
   * @param crosstrack crosstrack delta-V (km/s)
   */
  public maneuver(radial: number, intrack: number, crosstrack: number) {
    const ric = this.toRIC(this);
    return ric.addVelocity(radial, intrack, crosstrack).toJ2000();
  }
}
