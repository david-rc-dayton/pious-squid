import { EarthBody } from "../bodies/earth-body";
import { getFinalsData } from "../data/data-handler";
import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";
import { Geodetic } from "./geodetic";
import { J2000 } from "./j2000";

/** Class representing ITRF Earth-Fixed coordinates. */
export class ITRF {
  /** Satellite state epoch. */
  public readonly epoch: EpochUTC;
  /** Position 3-vector, in kilometers. */
  public readonly position: Vector3D;
  /** Velocity 3-vector, in kilometers per second. */
  public readonly velocity: Vector3D;

  /**
   * Create a new ITRF object.
   *
   * @param epoch UTC epoch
   * @param position ITRF position, in kilometers
   * @param velocity ITRF velocity, in kilometers per second
   */
  constructor(epoch: EpochUTC, position: Vector3D, velocity?: Vector3D) {
    this.epoch = epoch;
    this.position = position;
    this.velocity = velocity || Vector3D.origin();
  }

  public toJ2000() {
    const { epoch, position, velocity } = this;
    const finals = getFinalsData(epoch.toMjd());
    const pmX = finals.pmX;
    const pmY = finals.pmY;
    const rPEF = position.rot2(pmX).rot1(pmY);
    const vPEF = velocity.rot2(pmX).rot1(pmY);
    const nut = EarthBody.nutation(epoch);
    const epsilon = nut[2] + nut[1];
    const ast = epoch.gmstAngle() + nut[0] * Math.cos(epsilon);
    const rTOD = rPEF.rot3(-ast);
    const vTOD = vPEF.add(EarthBody.ROTATION.cross(position)).rot3(-ast);
    const rMOD = rTOD
      .rot1(epsilon)
      .rot3(nut[0])
      .rot1(-nut[2]);
    const vMOD = vTOD
      .rot1(epsilon)
      .rot3(nut[0])
      .rot1(-nut[2]);
    const prec = EarthBody.precession(epoch);
    const rJ2000 = rMOD
      .rot3(prec[2])
      .rot2(-prec[1])
      .rot3(prec[0]);
    const vJ2000 = vMOD
      .rot3(prec[2])
      .rot2(-prec[1])
      .rot3(prec[0]);
    return new J2000(epoch, rJ2000, vJ2000);
  }

  public toGeodetic() {
    const {
      position: { x, y, z }
    } = this;
    var sma = EarthBody.RADIUS_EQUATOR;
    var esq = EarthBody.ECCENTRICITY_SQUARED;
    var lon = Math.atan2(y, x);
    var r = Math.sqrt(x * x + y * y);
    var phi = Math.atan(z / r);
    var lat = phi;
    var c = 0.0;
    for (var i = 0; i < 6; i++) {
      var slat = Math.sin(lat);
      c = 1 / Math.sqrt(1 - esq * slat * slat);
      lat = Math.atan((z + sma * c * esq * Math.sin(lat)) / r);
    }
    var alt = r / Math.cos(lat) - sma * c;
    return new Geodetic(lat, lon, alt);
  }
}
