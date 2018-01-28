import { nutation, precession } from "../bodies"
import { Epoch } from "../epoch"
import { Vector } from "../vector"
import { EarthCenteredInertial } from "./earth-centered-inertial"

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
}
