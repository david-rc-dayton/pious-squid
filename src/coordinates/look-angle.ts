import { RAD2DEG } from "../math/constants";

/** Class representing look angles. */
export class LookAngle {
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
    this.azimuth = azimuth;
    this.elevation = elevation;
    this.range = range;
  }

  /** Return a string representation of the object. */
  public toString(): string {
    const { azimuth, elevation, range } = this;
    const output = [
      "[Look-Angle]",
      `  Azimuth:  ${(azimuth * RAD2DEG).toFixed(3)}\u00b0`,
      `  Elevation:  ${(elevation * RAD2DEG).toFixed(3)}\u00b0`,
      `  Range:  ${range.toFixed(3)} km`
    ];
    return output.join("\n");
  }
}
