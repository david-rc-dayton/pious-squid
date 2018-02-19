import { Coordinate, CoordinateType } from './coordinate-config'

/** Class representing look angles. */
export class LookAngle implements Coordinate {
  /** Coordinate identifier string. */
  public type: string
  /** Azimuth angle, in radians. */
  public azimuth: number
  /** Elevation angle, in radians. */
  public elevation: number
  /** Slant range, in kilometers. */
  public range: number

  /**
   * Create a new LookAngle object.
   *
   * @param azimuth azimuth angle, in radians
   * @param elevation elevation angle, in radians
   * @param range slant range, in kilometers
   */
  constructor (azimuth: number, elevation: number, range: number) {
    this.type = CoordinateType.LOOK_ANGLE
    this.azimuth = azimuth
    this.elevation = elevation
    this.range = range
  }
}
