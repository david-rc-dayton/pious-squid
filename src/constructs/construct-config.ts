/** Options for the Satellite constructor. */
export interface SatelliteOptions {
  /** Satellite name. */
  name?: string
}

/** Options for the GroundStation constructor. */
export interface GroundStationOptions {
  /** Ground station name. */
  name?: string
  /** Site minimum elevation, in radians. */
  minEl?: number
}
