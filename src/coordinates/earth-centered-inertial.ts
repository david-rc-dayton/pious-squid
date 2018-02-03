import { nutation, precession } from "../bodies";
import { EARTH_ROTATION } from "../constants";
import { Epoch } from "../epoch";
import { Vector } from "../vector";
import { EarthCenteredFixed } from "./earth-centered-fixed";
import { J2000 } from "./j2000";

export class EarthCenteredInertial {
    public epoch: Epoch;
    public position: Vector;
    public velocity: Vector;

    constructor(millis: number, ri: number, rj: number, rk: number,
                vi: number, vj: number, vk: number) {
        this.epoch = new Epoch(millis);
        this.position = new Vector(ri, rj, rk);
        this.velocity = new Vector(vi, vj, vk);
    }

    public getState(): number[] {
        const { position, velocity } = this;
        return position.concat(velocity).state;
    }

    public toECEF(): EarthCenteredFixed {
        const { epoch, position, velocity } = this;
        const [dLon, dObliq, mObliq] = nutation(epoch);
        const obliq = mObliq + dObliq;
        const ast = epoch.getGMSTAngle() + dLon * Math.cos(obliq);
        const rPef = position.rot3(ast);
        let vPef = velocity.rot3(ast);
        const rotVec = EARTH_ROTATION.cross(rPef);
        vPef = vPef.add(rotVec.scale(-1));
        const [rx, ry, rz, vx, vy, vz] = rPef.concat(vPef).state;
        return new EarthCenteredFixed(rx, ry, rz, vx, vy, vz);
    }

    public toJ2K(): J2000 {
        const { epoch, position, velocity } = this;
        const [zeta, theta, zed] = precession(epoch);
        const [dLon, dObliq, mObliq] = nutation(epoch);
        const obliq = mObliq + dObliq;
        const rmod = position.rot1(obliq).rot3(dLon).rot1(-mObliq);
        const vmod = velocity.rot1(obliq).rot3(dLon).rot1(-mObliq);
        const rj2k = rmod.rot3(zed).rot2(-theta).rot3(zeta);
        const vj2k = vmod.rot3(zed).rot2(-theta).rot3(zeta);
        const [ri, rj, rk, vi, vj, vk] = rj2k.concat(vj2k).state;
        return new J2000(epoch.toMillis(), ri, rj, rk, vi, vj, vk);
    }
}
