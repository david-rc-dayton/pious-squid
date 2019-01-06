import { EarthBody } from "../bodies/earth-body";
import { getFinalsData } from "../data/data-handler";
import { TWO_PI } from "../math/constants";
import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";
import { ClassicalElements } from "./classical-elements";
import { ITRF } from "./itrf";

/** Class representing J2000 (J2K) inertial coordinates. */
export class J2000 {
  /** Satellite state epoch. */
  public readonly epoch: EpochUTC;
  /** Position 3-vector, in kilometers. */
  public readonly position: Vector3D;
  /** Velocity 3-vector, in kilometers per second. */
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

  /** Return a string representation of the object. */
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
    const nut = EarthBody.nutation(epoch);
    const epsilon = nut[2] + nut[1];
    const rTOD = rMOD
      .rot1(nut[2])
      .rot3(-nut[0])
      .rot1(-epsilon);
    const vTOD = vMOD
      .rot1(nut[2])
      .rot3(-nut[0])
      .rot1(-epsilon);
    const ast = epoch.gmstAngle() + nut[0] * Math.cos(epsilon);
    const rPEF = rTOD.rot3(ast);
    const vPEF = vTOD.rot3(ast).add(EarthBody.ROTATION.negate().cross(rPEF));
    const { pmX, pmY } = getFinalsData(epoch.toMjd());
    const rITRF = rPEF.rot1(-pmY).rot2(-pmX);
    const vITRF = vPEF.rot1(-pmY).rot2(-pmX);
    return new ITRF(epoch, rITRF, vITRF);
  }
}
