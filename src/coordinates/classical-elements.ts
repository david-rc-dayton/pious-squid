import { EARTH_MU, RAD2DEG, TWO_PI } from "../math/constants";
import { EpochUTC } from "../time/epoch-utc";
import { Vector3D } from "../math/vector-3d";
import { J2000 } from "./j2000";

/** Class representing Keplerian orbital elements. */
export class KeplerianElements {
  /** Satellite state epoch. */
  public readonly epoch: EpochUTC;
  /** Semimajor axis, in kilometers. */
  public readonly a: number;
  /** Orbit eccentricity (unitless). */
  public readonly e: number;
  /** Inclination, in radians. */
  public readonly i: number;
  /** Right ascension of the ascending node, in radians. */
  public readonly o: number;
  /** Argument of perigee, in radians. */
  public readonly w: number;
  /** True anomaly, in radians. */
  public readonly v: number;

  /**
   * Create a new Keplerian object.
   *
   * @param millis milliseconds since 1 January 1970, 00:00 UTC
   * @param a semimajor axis, in kilometers
   * @param e orbit eccentricity (unitless)
   * @param i inclination, in radians
   * @param o right ascension of the ascending node, in radians
   * @param w argument of perigee, in radians
   * @param v true anomaly, in radians
   */
  constructor(
    millis: number,
    a: number,
    e: number,
    i: number,
    o: number,
    w: number,
    v: number
  ) {
    this.epoch = new EpochUTC(millis);
    this.a = a;
    this.e = e;
    this.i = i;
    this.o = o;
    this.w = w;
    this.v = v;
  }

  /** Return a string representation of the object. */
  public toString() {
    const { epoch, a, e, i, o, w, v } = this;
    const epochOut = epoch.toString();
    const aOut = a.toFixed(3);
    const eOut = e.toFixed(6);
    const iOut = (i * RAD2DEG).toFixed(4);
    const oOut = (o * RAD2DEG).toFixed(4);
    const wOut = (w * RAD2DEG).toFixed(4);
    const vOut = (v * RAD2DEG).toFixed(4);
    return [
      "[KeplerianElements]",
      `  Epoch:  ${epochOut}`,
      `  (a) Semimajor Axis:  ${aOut} km`,
      `  (e) Eccentricity:  ${eOut}`,
      `  (i) Inclination:  ${iOut}\u00b0`,
      `  (\u03a9) Right Ascension:  ${oOut}\u00b0`,
      `  (\u03c9) Argument of Perigee:  ${wOut}\u00b0`,
      `  (\u03bd) True Anomaly:  ${vOut}\u00b0`
    ].join("\n");
  }

  /** Convert to the J2000 (J2K) inertial coordinate frame. */
  public toJ2K(): J2000 {
    const { epoch, a, e, i, o, w, v } = this;
    const { cos, sin, sqrt } = Math;
    const rPqw = new Vector3D(cos(v), sin(v), 0).scale(
      (a * (1 - e ** 2)) / (1 + e * cos(v))
    );
    const vPqw = new Vector3D(-sin(v), e + cos(v), 0).scale(
      sqrt(EARTH_MU / (a * (1 - e ** 2)))
    );
    const rJ2k = rPqw
      .rot3(-w)
      .rot1(-i)
      .rot3(-o);
    const vJ2k = vPqw
      .rot3(-w)
      .rot1(-i)
      .rot3(-o);
    const [ri, rj, rk, vi, vj, vk] = rJ2k.concat(vJ2k).state;
    return new J2000(epoch.millis, ri, rj, rk, vi, vj, vk);
  }

  /** Calculate the satellite's mean motion, in radians per second. */
  public meanMotion(): number {
    return Math.sqrt(EARTH_MU / this.a ** 3);
  }

  /** Calculate the number of revolutions the satellite completes per day. */
  public revsPerDay(): number {
    return this.meanMotion() * (86400 / TWO_PI);
  }
}
