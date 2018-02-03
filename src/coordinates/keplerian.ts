import { EARTH_MU } from "../constants";
import { Epoch } from "../epoch";
import { Vector } from "../vector";
import { J2000 } from "./j2000";

export class Keplerian {
    public epoch: Epoch;
    public a: number;
    public e: number;
    public i: number;
    public o: number;
    public w: number;
    public v: number;

    constructor(epoch: Epoch, a: number, e: number, i: number,
                o: number, w: number, v: number) {
        this.epoch = epoch;
        this.a = a;
        this.e = e;
        this.i = i;
        this.o = o;
        this.w = w;
        this.v = v;
    }

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
