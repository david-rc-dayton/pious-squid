import { RAD2DEG } from "../constants";
import { CoordinateType, ICoordinate } from "./coordinate-config";

/** Class representing Geocentric (LLA) coordinates. */
export class Geocentric implements ICoordinate {
  /** Coordinate identifier string. */
  public readonly type: string;
  /** Geocentric latitude, in radians. */
  public readonly latitude: number;
  /** Geocentric longitude, in radians. */
  public readonly longitude: number;
  /** Geocentric altitude, in kilometers. */
  public readonly altitude: number;

  /**
   * Create a new Geocentric object.
   *
   * @param latitude geocentric latitude, in radians
   * @param longitude gecentric longitude, in radians
   * @param altitude geocentric altitude, in kilometers
   */
  constructor(latitude: number, longitude: number, altitude: number) {
    this.type = CoordinateType.GEOCENTRIC;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
  }

  /** Return a string representation of the object. */
  public toString(): string {
    const { latitude, longitude, altitude } = this;
    const output = [
      "[Geocentric]",
      `  Latitude:  ${(latitude * RAD2DEG).toFixed(3)}\u00b0`,
      `  Longitude:  ${(longitude * RAD2DEG).toFixed(3)}\u00b0`,
      `  Altitude:  ${altitude.toFixed(3)} km`
    ];
    return output.join("\n");
  }
}
