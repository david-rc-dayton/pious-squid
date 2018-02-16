import { EARTH_MU, RAD2DEG, TWO_PI } from '../constants'
import { Epoch } from '../epoch'
import { Vector } from '../vector'
import { CoordinateType, ICoordinate } from './coordinate-config'
import { J2000 } from './j2000'

/** Class representing Keplerian orbital elements. */
export class KeplerianElements implements ICoordinate {
  /** Coordinate identifier string. */
  public readonly type: CoordinateType
  /** Satellite state epoch. */
  public readonly epoch: Epoch
  /** Semimajor axis, in kilometers. */
  public readonly a: number
  /** Orbit eccentricity (unitless). */
  public readonly e: number
  /** Inclination, in radians. */
  public readonly i: number
  /** Right ascension of the ascending node, in radians. */
  public readonly o: number
  /** Argument of perigee, in radians. */
  public readonly w: number
  /** True anomaly, in radians. */
  public readonly v: number

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
  constructor (millis: number, a: number, e: number, i: number,
    o: number, w: number, v: number) {
    this.type = CoordinateType.KEPLERIAN_ELEMENTS
    this.epoch = new Epoch(millis)
    this.a = a
    this.e = e
    this.i = i
    this.o = o
    this.w = w
    this.v = v
  }

  /** Return a string representation of the object. */
  public toString () {
    const { epoch, a, e, i, o, w, v } = this
    return [
      '[KeplerianElements]',
      `  Epoch: ${epoch.toString()}`,
      `  Semimajor Axis: ${a.toFixed(3)} km`,
      `  Eccentricity: ${e.toFixed(6)}`,
      `  Inclination: ${(i * RAD2DEG).toFixed(4)}\u00b0`,
      `  Right Ascension: ${(o * RAD2DEG).toFixed(4)}\u00b0`,
      `  Argument of Perigee: ${(w * RAD2DEG).toFixed(4)}\u00b0`,
      `  True Anomaly: ${(v * RAD2DEG).toFixed(4)}\u00b0`
    ].join('\n')
  }

  /** Convert to the J2000 (J2K) inertial coordinate frame. */
  public toJ2K (): J2000 {
    const { epoch, a, e, i, o, w, v } = this
    const { cos, sin, pow, sqrt } = Math
    const rPqw = new Vector(cos(v), sin(v), 0)
      .scale((a * (1 - pow(e, 2))) / (1 + e * cos(v)))
    const vPqw = new Vector(-sin(v), e + cos(v), 0)
      .scale(sqrt(EARTH_MU / (a * (1 - pow(e, 2)))))
    const rJ2k = rPqw.rot3(-w).rot1(-i).rot3(-o)
    const vJ2k = vPqw.rot3(-w).rot1(-i).rot3(-o)
    const [ri, rj, rk, vi, vj, vk] = rJ2k.concat(vJ2k).state
    return new J2000(epoch.toMillis(), ri, rj, rk, vi, vj, vk)
  }

  /** Calculate the satellite's mean motion, in revolutions per day. */
  public meanMotion (): number {
    return Math.sqrt(EARTH_MU / Math.pow(this.a, 3)) * (86400 / TWO_PI)
  }
}
