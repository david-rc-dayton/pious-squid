import { nutation, precession } from "../bodies"
import { EARTH_ROTATION } from "../constants"
import { Epoch } from "../epoch"
import { Vector } from "../vector"
import { EarthCenteredFixed } from "./earth-centered-fixed"
import { J2000 } from "./j2000"

export class EarthCenteredInertial {
    public epoch: Epoch
    public position: Vector
    public velocity: Vector

    constructor(epoch: Epoch, position: Vector, velocity: Vector) {
        this.epoch = epoch
        this.position = position
        this.velocity = velocity
    }

    public toECEF(): EarthCenteredFixed {
        let [dLon, dObliq, mObliq] = nutation(this.epoch)
        let obliq = mObliq + dObliq
        let ast = this.epoch.getGMSTAngle() + dLon * Math.cos(obliq)
        let rPef = this.position.rot3(ast)
        let vPef = this.velocity.rot3(ast)
        let rotVec = EARTH_ROTATION.cross(rPef)
        vPef = vPef.add(rotVec.scale(-1))
        return new EarthCenteredFixed(rPef, vPef)
    }

    public toJ2K(): J2000 {
        let [zeta, theta, zed] = precession(this.epoch)
        let [dLon, dObliq, mObliq] = nutation(this.epoch)
        let obliq = mObliq + dObliq
        let rmod = this.position.rot1(obliq).rot3(dLon).rot1(-mObliq)
        let vmod = this.velocity.rot1(obliq).rot3(dLon).rot1(-mObliq)
        let rj2k = rmod.rot3(zed).rot2(-theta).rot3(zeta)
        let vj2k = vmod.rot3(zed).rot2(-theta).rot3(zeta)
        return new J2000(this.epoch, rj2k, vj2k)
    }
}
