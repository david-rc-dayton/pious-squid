import { LookAngle } from "./look-angle";

export class Topocentric {
    public s: number;
    public e: number;
    public z: number;

    constructor(s: number, e: number, z: number) {
        this.s = s;
        this.e = e;
        this.z = z;
    }

    public toLookAngle(): LookAngle {
        const { s, e, z } = this;
        const range = Math.sqrt(s * s + e * e + z * z);
        const elevation = Math.asin(z / range);
        const azimuth = Math.atan2(-e, s) + Math.PI;
        return new LookAngle(azimuth, elevation, range);
    }
}
