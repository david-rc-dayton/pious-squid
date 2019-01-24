import { EarthBody } from "../bodies/earth-body";
import { RAD2DEG } from "../math/constants";
import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";
import { ITRF } from "./itrf";

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

  /**
   * Convert this to an ITRF coordinate object.
   *
   * @param epoch UTC epoch
   */
  public toITRF(epoch: EpochUTC) {
    const { latitude, longitude, altitude } = this;
    const sLat = Math.sin(latitude);
    const cLat = Math.cos(latitude);
    const nVal =
      EarthBody.RADIUS_EQUATOR /
      Math.sqrt(1 - EarthBody.ECCENTRICITY_SQUARED * sLat * sLat);
    const rx = (nVal + altitude) * cLat * Math.cos(longitude);
    const ry = (nVal + altitude) * cLat * Math.sin(longitude);
    const rz = (nVal * (1 - EarthBody.ECCENTRICITY_SQUARED) + altitude) * sLat;
    return new ITRF(epoch, new Vector3D(rx, ry, rz));
  }
}
