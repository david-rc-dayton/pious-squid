/** Interface for state vector objects. */
export interface ICoordinate {
  /** Coordinate identifier string. */
  type: string;
}

/** Coordinate type identifiers. */
export enum CoordinateType {
  ITRF = "itrf",
  GEODETIC = "geodetic",
  J2000 = "j2000"
}
