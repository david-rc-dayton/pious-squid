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
        const { a, e, i, o, w, v } = this;
        const rPqw = new Vector(Math.cos(v), Math.sin(v), 0)
            .scale((a * (1 - Math.pow(e, 2))) / (1 + e * Math.cos(v)));
        const vPqw = new Vector(-Math.sin(v), e + Math.cos(v), 0)
            .scale(Math.sqrt(EARTH_MU / (a * (1 - Math.pow(e, 2)))));
        const rJ2k = rPqw.rot3(-w).rot1(-i).rot3(-o);
        const vJ2k = vPqw.rot3(-w).rot1(-i).rot3(-o);
        const [ri, rj, rk, vi, vj, vk] = rJ2k.concat(vJ2k).state;
        return new J2000(this.epoch.toMillis(), ri, rj, rk, vi, vj, vk);
    }
}
