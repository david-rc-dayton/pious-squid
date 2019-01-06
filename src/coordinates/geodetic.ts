import { EarthBody } from "../bodies/earth-body";
import { RAD2DEG } from "../math/constants";

/** Class representing Geodetic (LLA) coordinates. */
export class Geodetic {
  /** Geodetic latitude, in radians. */
  public readonly latitude: number;
  /** Geodetic longitude, in radians. */
  public readonly longitude: number;
  /** Geodetic altitude, in kilometers. */
  public readonly altitude: number;

  /**
   * Create a new Geodetic object.
   *
   * @param latitude geodetic latitude, in radians
   * @param longitude geodetic longitude, in radians
   * @param altitude geodetic altitude, in kilometers
   */
  constructor(latitude: number, longitude: number, altitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
  }

  /** Geocentric latitude of the object. */
  public geocentricLatitude(): number {
    return Math.atan(
      (1 - EarthBody.ECCENTRICITY_SQUARED) * Math.tan(this.latitude)
    );
  }

  /** Return a string representation of the object. */
  public toString(): string {
    const { latitude, longitude, altitude } = this;
    const output = [
      "[Geodetic]",
      `  Latitude:  ${(latitude * RAD2DEG).toFixed(3)}\u00b0`,
      `  Longitude:  ${(longitude * RAD2DEG).toFixed(3)}\u00b0`,
      `  Altitude:  ${altitude.toFixed(3)} km`
    ];
    return output.join("\n");
  }
}
