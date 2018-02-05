import { nutation, precession } from "../bodies";
import { EARTH_MU, TWO_PI } from "../constants";
import { Epoch } from "../epoch";
import { Vector } from "../vector";
import { EarthCenteredInertial } from "./earth-centered-inertial";
import { KeplerianElements } from "./keplerian-elements";

/** Class representing J2000 (J2K) inertial coordinates. */
export class J2000 {
    /** Satellite state epoch. */
    public epoch: Epoch;
    /** Position 3-vector, in kilometers. */
    public position: Vector;
    /** Velocity 3-vector, in kilometers per second. */
    public velocity: Vector;

    /**
     * Create a new J2000 object.
     *
     * @param millis milliseconds since 1 January 1970, 00:00 UTC
     * @param ri i-axis position, in kilometers
     * @param rj j-axis position, in kilometers
     * @param rk j-axis position, in kilometers
     * @param vi i-axis velocity, in kilometers per second
     * @param vj j-axis velocity, in kilometers per second
     * @param vk k-axis velocity, in kilometers per second
     */
    constructor(millis: number, ri: number, rj: number, rk: number,
                vi: number, vj: number, vk: number) {
        this.epoch = new Epoch(millis);
        this.position = new Vector(ri, rj, rk);
        this.velocity = new Vector(vi, vj, vk);
    }

    /** Convert to the Earth Centered Inertial (ECI) coordinate frame. */
    public toECI(): EarthCenteredInertial {
        const { epoch, position, velocity } = this;
        const [zeta, theta, zed] = precession(epoch);
        const [dLon, dObliq, mObliq] = nutation(epoch);
        const obliq = mObliq + dObliq;
        const rmod = position.rot3(-zeta).rot2(theta).rot3(-zed);
        const vmod = velocity.rot3(-zeta).rot2(theta).rot3(-zed);
        const rtod = rmod.rot1(mObliq).rot3(-dLon).rot1(-obliq);
        const vtod = vmod.rot1(mObliq).rot3(-dLon).rot1(-obliq);
        const [ri, rj, rk, vi, vj, vk] = rtod.concat(vtod).state;
        return new EarthCenteredInertial(epoch.toMillis(),
            ri, rj, rk, vi, vj, vk);
    }

    /** Convert to Keplerian elements. */
    public toKeplerianElements(): KeplerianElements {
        const { epoch, position, velocity } = this;
        const [R, V] = [position.magnitude(), velocity.magnitude()];
        const energy = ((V * V) / 2) - (EARTH_MU / R);
        const a = -(EARTH_MU / (2 * energy));
        const eVecA = position.scale((V * V) - (EARTH_MU / R));
        const eVecB = velocity.scale(position.dot(velocity));
        const eVec = eVecA.add(eVecB.scale(-1)).scale(1 / EARTH_MU);
        const e = eVec.magnitude();
        const h = position.cross(velocity);
        const i = Math.acos(h.state[2] / h.magnitude()) % 180;
        const n = new Vector(0, 0, 1).cross(h);
        let o = Math.acos(n.state[0] / n.magnitude());
        if (n.state[1] < 0) {
            o = TWO_PI - o;
        }
        let w = Math.acos(n.dot(eVec) / (n.magnitude() * e));
        if (eVec.state[2] < 0) {
            w = TWO_PI - w;
        }
        let v = Math.acos(eVec.dot(position) / (e * R));
        if (position.dot(velocity) < 0) {
            v = TWO_PI - v;
        }
        return new KeplerianElements(epoch.toMillis(), a, e, i, o, w, v);
    }
}
