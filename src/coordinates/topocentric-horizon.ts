import { Coordinate, CoordinateType } from './coordinate-config'
import { LookAngle } from './look-angle'

/** Class representing topocentric-horizon coordinates. */
export class TopocentricHorizon implements Coordinate {
  /** Coordinate identifier string. */
  public type: string
  /** South component, in kilometers. */
  public s: number
  /** East component, in kilometers. */
  public e: number
  /** Surface-normal component, in kilometers. */
  public z: number

  /**
   * Create a new Topocentric object.
   *
   * @param s south component, in kilometers
   * @param e east component, in kilometers
   * @param z surface-normal component, in kilometers
   */
  constructor (s: number, e: number, z: number) {
    this.type = CoordinateType.TOPOCENTRIC_HORIZON
    this.s = s
    this.e = e
    this.z = z
  }

  /** Convert to look angles. */
  public toLookAngle (): LookAngle {
    const { s, e, z } = this
    const range = Math.sqrt(s * s + e * e + z * z)
    const elevation = Math.asin(z / range)
    const azimuth = Math.atan2(-e, s) + Math.PI
    return new LookAngle(azimuth, elevation, range)
  }
}
