import { EARTH_MU } from "../constants";
import { Epoch } from "../epoch";
import { Vector } from "../vector";
import { J2000 } from "./j2000";

/** Class representing Keplerian elements. */
export class Keplerian {
    /** Satellite state epoch. */
    public epoch: Epoch;
    /** Semimajor axis, in kilometers. */
    public a: number;
    /** Orbit eccentricity (unitless). */
    public e: number;
    /** Inclination, in radians. */
    public i: number;
    /** Right ascension of the ascending node, in radians. */
    public o: number;
    /** Argument of perigee, in radians. */
    public w: number;
    /** True anomaly, in radians. */
    public v: number;

    /**
     * Create a new Keplerian object.
     *
     * @param millis milliseconds since 1 January 1970, 00:00 UTC
     * @param a semimajor axis, in kilometers
     * @param e orbit eccentricity (unitless)
     * @param i inclination, in radians
     * @param o right ascension of the ascending node, in radians
     * @param w argument of perigee, in radians
     * @param v true anomaly, in radians
     */
    constructor(millis: number, a: number, e: number, i: number,
                o: number, w: number, v: number) {
        this.epoch = new Epoch(millis);
        this.a = a;
        this.e = e;
        this.i = i;
        this.o = o;
        this.w = w;
        this.v = v;
    }

    /** Convert to the J2000 (J2K) inertial coordinate frame. */
    public toJ2K(): J2000 {
        const { epoch, a, e, i, o, w, v } = this;
        const { cos, sin, pow, sqrt } = Math;
        const rPqw = new Vector(cos(v), sin(v), 0)
            .scale((a * (1 - pow(e, 2))) / (1 + e * cos(v)));
        const vPqw = new Vector(-sin(v), e + cos(v), 0)
            .scale(sqrt(EARTH_MU / (a * (1 - pow(e, 2)))));
        const rJ2k = rPqw.rot3(-w).rot1(-i).rot3(-o);
        const vJ2k = vPqw.rot3(-w).rot1(-i).rot3(-o);
        const [ri, rj, rk, vi, vj, vk] = rJ2k.concat(vJ2k).state;
        return new J2000(epoch.toMillis(), ri, rj, rk, vi, vj, vk);
    }
}
