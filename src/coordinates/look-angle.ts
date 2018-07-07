import { CoordinateType, ICoordinate } from "./coordinate-config";

/** Class representing look angles. */
export class LookAngle implements ICoordinate {
  /** Coordinate identifier string. */
  public readonly type: string;
  /** Azimuth angle, in radians. */
  public readonly azimuth: number;
  /** Elevation angle, in radians. */
  public readonly elevation: number;
  /** Slant range, in kilometers. */
  public readonly range: number;

  /**
   * Create a new LookAngle object.
   *
   * @param azimuth azimuth angle, in radians
   * @param elevation elevation angle, in radians
   * @param range slant range, in kilometers
   */
  constructor(azimuth: number, elevation: number, range: number) {
    this.type = CoordinateType.LOOK_ANGLE;
    this.azimuth = azimuth;
    this.elevation = elevation;
    this.range = range;
  }
}
