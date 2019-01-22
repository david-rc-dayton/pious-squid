import { EarthBody } from "../bodies/earth-body";
import { DataHandler } from "../data/data-handler";
import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";
import { Geodetic } from "./geodetic";
import { J2000 } from "./j2000";
import { LookAngle } from "./look-angle";

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

  /** Return a string representation of this object. */
  public toString(): string {
    const { epoch, position, velocity } = this;
    const output = [
      "[ITRF]",
      `  Epoch:  ${epoch.toString()}`,
      `  Position:  ${position.toString()} km`,
      `  Velocity:  ${velocity.toString()} km/s`
    ];
    return output.join("\n");
  }

  /** Convert this to a J2000 state vector object. */
  public toJ2000() {
    const { epoch, position, velocity } = this;
    const finals = DataHandler.getFinalsData(epoch.toMjd());
    const pmX = finals.pmX;
    const pmY = finals.pmY;
    const rPEF = position.rot2(pmX).rot1(pmY);
    const vPEF = velocity.rot2(pmX).rot1(pmY);
    const [dPsi, dEps, mEps] = EarthBody.nutation(epoch);
    const epsilon = mEps + dEps;
    const ast = epoch.gmstAngle() + dPsi * Math.cos(epsilon);
    const rTOD = rPEF.rot3(-ast);
    const vTOD = vPEF
      .add(EarthBody.getRotation(this.epoch).cross(rPEF))
      .rot3(-ast);
    const rMOD = rTOD
      .rot1(epsilon)
      .rot3(dPsi)
      .rot1(-mEps);
    const vMOD = vTOD
      .rot1(epsilon)
      .rot3(dPsi)
      .rot1(-mEps);
    const [zeta, theta, zed] = EarthBody.precession(epoch);
    const rJ2000 = rMOD
      .rot3(zed)
      .rot2(-theta)
      .rot3(zeta);
    const vJ2000 = vMOD
      .rot3(zed)
      .rot2(-theta)
      .rot3(zeta);
    return new J2000(epoch, rJ2000, vJ2000);
  }

  /** Convert to a Geodetic coordinate object. */
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

  public toLookAngle(observer: Geodetic) {
    const { latitude, longitude } = observer;
    const { sin, cos } = Math;
    const { x: oX, y: oY, z: oZ } = observer.toITRF(this.epoch).position;
    const { x: tX, y: tY, z: tZ } = this.position;
    const [rX, rY, rZ] = [tX - oX, tY - oY, tZ - oZ];
    const s =
      sin(latitude) * cos(longitude) * rX +
      sin(latitude) * sin(longitude) * rY -
      cos(latitude) * rZ;
    const e = -sin(longitude) * rX + cos(longitude) * rY;
    const z =
      cos(latitude) * cos(longitude) * rX +
      cos(latitude) * sin(longitude) * rY +
      sin(latitude) * rZ;
    const range = Math.sqrt(s * s + e * e + z * z);
    const elevation = Math.asin(z / range);
    const azimuth = Math.atan2(-e, s) + Math.PI;
    return new LookAngle(azimuth, elevation, range);
  }
}
