/** Options for the Satellite constructor. */
export interface ISatelliteOptions {
    /** Satellite name. */
    name?: string;
}

/** Options for the GroundStation constructor. */
export interface IGroundStationOptions {
    /** Satellite name. */
    name?: string;
    /** Site minimum elevation, in radians. */
    minEl?: number;
}
