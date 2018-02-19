/** Interface for coordinate objects. */
export interface Coordinate {
  /** Coordinate identifier string. */
  type: string
}

/** Coordinate type identifiers. */
export enum CoordinateType {
  EARTH_CENTERED_FIXED = 'ecef',
  EARTH_CENTERED_INERTIAL = 'eci',
  GEODETIC = 'geodetic',
  J2000 = 'j2k',
  KEPLERIAN_ELEMENTS = 'keplerian',
  LOOK_ANGLE = 'look-angle',
  SPHERICAL = 'spherical',
  TOPOCENTRIC_HORIZON = 'topocentric-horizon'
}
