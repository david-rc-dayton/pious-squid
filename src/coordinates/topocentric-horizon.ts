import { Coordinate, CoordinateType } from './coordinate-config'
import { LookAngle } from './look-angle'

/** Class representing topocentric-horizon coordinates. */
export class TopocentricHorizon implements Coordinate {
  /** Coordinate identifier string. */
  public readonly type: string
  /** South component, in kilometers. */
  public readonly s: number
  /** East component, in kilometers. */
  public readonly e: number
  /** Surface-normal component, in kilometers. */
  public readonly z: number

  /**
   * Create a new Topocentric object.
   *
   * @param s south component, in kilometers
   * @param e east component, in kilometers
   * @param z zenith component, in kilometers
   */
  constructor (s: number, e: number, z: number) {
    this.type = CoordinateType.TOPOCENTRIC_HORIZON
    this.s = s
    this.e = e
    this.z = z
  }

  /** Return a string representation of the object. */
  public toString (): string {
    const { s, e, z } = this
    return [
      '[Topocentric]',
      `  (S)outh:  ${s.toFixed(3)} km`,
      `  (E)ast:  ${e.toFixed(3)} km`,
      `  (Z)enith:  ${z.toFixed(3)} km`
    ].join('\n')
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
