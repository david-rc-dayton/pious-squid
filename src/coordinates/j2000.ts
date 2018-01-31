import { nutation, precession } from "../bodies"
import { Epoch } from "../epoch"
import { Vector } from "../vector"
import { EarthCenteredInertial } from "./earth-centered-inertial"
import { Keplerian } from './keplerian'
import { EARTH_MU } from '../constants'

export class J2000 {
    public epoch: Epoch
    public position: Vector
    public velocity: Vector

    constructor(epoch: Epoch, position: Vector, velocity: Vector) {
        this.epoch = epoch
        this.position = position
        this.velocity = velocity
    }

    public toECI(): EarthCenteredInertial {
        let [zeta, theta, zed] = precession(this.epoch)
        let [dLon, dObliq, mObliq] = nutation(this.epoch)
        let obliq = mObliq + dObliq
        let rmod = this.position.rot3(-zeta).rot2(theta).rot3(-zed)
        let vmod = this.velocity.rot3(-zeta).rot2(theta).rot3(-zed)
        let rtod = rmod.rot1(mObliq).rot3(-dLon).rot1(-obliq)
        let vtod = vmod.rot1(mObliq).rot3(-dLon).rot1(-obliq)
        return new EarthCenteredInertial(this.epoch, rtod, vtod)
    }

    /**
     * Convert the J2000 coordinate object to a new Keplerian coordinate object.
     */
    public toKeplerian(): Keplerian {
        let [R, V] = [this.position.magnitude(), this.velocity.magnitude()]
        let energy = ((V * V) / 2) - (EARTH_MU / R)
        let a = -(EARTH_MU / (2 * energy))
        let eVecA = this.position.scale((V * V) - (EARTH_MU / R))
        let eVecB = this.velocity.scale(this.position.dot(this.velocity))
        let eVec = eVecA.add(eVecB.scale(-1)).scale(1 / EARTH_MU)
        let e = eVec.magnitude()
        let h = this.position.cross(this.velocity)
        let i = Math.acos(h.state[2] / h.magnitude()) % 180
        let n = new Vector([0, 0, 1]).cross(h)
        let o = Math.acos(n.state[0] / n.magnitude())
        if (n.state[1] < 0) {
            o = 2 * Math.PI - o
        }
        let w = Math.acos(n.dot(eVec) / (n.magnitude() * e))
        if (eVec.state[2] < 0) {
            w = 2 * Math.PI - w
        }
        let v = Math.acos(eVec.dot(this.position) / (e * R))
        if (this.position.dot(this.velocity) < 0) {
            v = 2 * Math.PI - v
        }
        return new Keplerian(this.epoch, a, e, i, o, w, v)
    }
}
