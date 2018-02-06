import { Geodetic } from "../coordinates/geodetic";
import { LookAngle } from "../coordinates/look-angle";
import { IGroundStationOptions } from "./construct-config";
import { Satellite } from "./satellite";

/** Class representing a ground station. */
export class GroundStation {
    /** Geodetic location of the ground station. */
    public location: Geodetic;
    /** Ground station name. */
    public name: string;
    /** Site minimum elevation, in radians. */
    public minEl: number;

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
        this.name = opts.name || "";
        this.minEl = opts.minEl || 0;
    }

    /**
     * Calculate look angles for the ground station to a satellite.
     *
     * @param satellite target satellite
     */
    public lookAngles(satellite: Satellite): LookAngle {
        return satellite.toECEF().toTopocentric(this.location).toLookAngle();
    }

    /**
     * Return true if a satellite is in view at the satellite's latest
     * propagated state, otherwise return false.
     *
     * @param satellite target satellite
     */
    public isVisible(satellite: Satellite): boolean {
        const { elevation } = this.lookAngles(satellite);
        return elevation >= this.minEl;
    }
}
