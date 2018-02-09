import { Geodetic } from "../coordinates/geodetic";
import { LookAngle } from "../coordinates/look-angle";
import { IGroundStationOptions } from "./construct-config";
import { Satellite } from "./satellite";

/** Default construct options. */
const DEFAULT_OPTIONS: IGroundStationOptions = {
    minEl: 0,
    name: "",
};

/** Class representing a ground station. */
export class GroundStation {
    /** Ground station name. */
    public readonly name: string;
    /** Geodetic location of the ground station. */
    public readonly location: Geodetic;
    /** Site minimum elevation, in radians. */
    public readonly minEl: number;

    /**
     * Create a new GroundStation object. If values are not specified in the
     * options argument, the following defaults are used:
     *
     *     name  = ""
     *     minEl = 0
     *
     * @param location geodetic location of the ground station
     * @param opts ground station options
     */
    constructor(location: Geodetic, opts?: IGroundStationOptions) {
        this.location = location;
        opts = opts || {};
        const mergeOpts = { ...DEFAULT_OPTIONS, ...opts };
        this.name = mergeOpts.name as string;
        this.minEl = mergeOpts.minEl as number;
    }

    /** Return a string representation of the object. */
    public toString(): string {
        return `Ground Station: ${this.name}\n` + location.toString();
    }

    /**
     * Calculate look angles for the ground station to a satellite.
     *
     * @param millis milliseconds since 1 January 1970, 00:00 UTC
     * @param satellite target satellite
     */
    public lookAngles(millis: number, satellite: Satellite): LookAngle {
        const state = satellite.propagate(millis);
        return state.toECI().toECEF()
            .toTopocentric(this.location).toLookAngle();
    }

    /**
     * Return true if a satellite is in view at the specified epoch, otherwise
     * return false.
     *
     * @param millis milliseconds since 1 January 1970, 00:00 UTC
     * @param satellite target satellite
     */
    public isVisible(millis: number, satellite: Satellite): boolean {
        const { elevation } = this.lookAngles(millis, satellite);
        return elevation >= this.minEl;
    }
}
