import { J2000 } from "../coordinates/j2000";
import { IPropagator } from "../propagators/propagator-interface";
import { ISatelliteOptions } from "./construct-config";

/** Default construct options. */
const DEFAULT_OPTIONS: ISatelliteOptions = {
    name: "",
};

/** Class representing a satellite. */
export class Satellite {
    /** Satellite name. */
    public readonly name: string;
    /** Satellite ephemeris propagator. */
    public readonly propagator: IPropagator;

    /** Create a new Satellite object. If values are not specified in the
     * options argument, the following defaults are used:
     *
     *     name = ""
     *
     * @param propagator satellite ephemeris propagator
     * @param opts satellite options
     */
    constructor(propagator: IPropagator, opts?: ISatelliteOptions) {
        this.propagator = propagator;
        opts = opts || {};
        const mergeOpts = { ...DEFAULT_OPTIONS, ...opts };
        this.name = mergeOpts.name as string;
    }

    /** Return a string representation of the object. */
    public toString(): string {
        return [
            "[Satellite]",
            `  Name: ${this.name}`,
            `  Propagator: ${this.propagator.type}`,
        ].join("\n");
    }

    /**
     * Propagate the satellite's state to a new epoch.
     *
     * @param millis milliseconds since 1 January 1970, 00:00 UTC
     */
    public propagate(millis: number): J2000 {
        return this.propagator.propagate(millis);
    }

    /**
     * Propagate state by some number of seconds, repeatedly, starting at a
     * specified epoch.
     *
     * @param millis propagation start time
     * @param interval seconds between output states
     * @param count number of steps to take
     */
    public step(millis: number, interval: number, count: number): J2000[] {
        return this.propagator.step(millis, interval, count);
    }
}
