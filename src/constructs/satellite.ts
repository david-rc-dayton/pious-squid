import { EarthCenteredFixed } from "../coordinates/earth-centered-fixed";
import { EarthCenteredInertial } from "../coordinates/earth-centered-inertial";
import { Geodetic } from "../coordinates/geodetic";
import { J2000 } from "../coordinates/j2000";
import { KeplerianElements } from "../coordinates/keplerian-elements";
import { Spherical } from "../coordinates/spherical";
import { IPropagator } from "../propagators/propagator-interface";
import { ISatelliteOptions } from "./construct-config";

/** Class representing a satellite. */
export class Satellite {
    /** Satellite name. */
    public name: string;
    /** Satellite ephemeris propagator. */
    public propagator: IPropagator;
    /** Cache for latest propagated state. */
    public state: J2000;

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
        this.name = opts.name || "";
        this.state = propagator.propagate(this.propagator.millis);
    }

    /**
     * Propagate the satellite's state to a new epoch.
     *
     * @param millis milliseconds since 1 January 1970, 00:00 UTC
     */
    public propagate(millis: number): Satellite {
        this.state = this.propagator.propagate(millis);
        return this;
    }

    /**
     * Propagate the satellite's state by some number of seconds.
     *
     * @param seconds seconds to propagate (+/-)
     */
    public step(seconds: number): Satellite {
        const nextEpoch = this.state.epoch.toMillis() + (seconds * 1000);
        this.propagate(nextEpoch);
        return this;
    }

    /** Convert to Earth Centered Earth Fixed (ECEF) coordinate frame. */
    public toECEF(): EarthCenteredFixed {
        return this.state.toECI().toECEF();
    }

    /** Convert to Earth Centered Inertial (ECI) coordinate frame. */
    public toECI(): EarthCenteredInertial {
        return this.state.toECI();
    }

    /** Convert to geodetic coordinates. */
    public toGeodetic(): Geodetic {
        return this.state.toECI().toECEF().toGeodetic();
    }

    /** Convert to J2000 (J2K) inertial coordinates. */
    public toJ2K(): J2000 {
        return this.state;
    }

    /** Convert to a Keplerian Element set. */
    public toKeplerian(): KeplerianElements {
        return this.state.toKeplerian();
    }

    /** Convert to spherical coordinates. */
    public toSpherical(): Spherical {
        return this.state.toECI().toECEF().toSpherical();
    }
}
