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
        const rPqw = new Vector([
            Math.cos(this.v), Math.sin(this.v), 0,
        ]).scale((this.a * (1 - Math.pow(this.e, 2)))
            / (1 + this.e * Math.cos(this.v)));
        const vPqw = new Vector([
            -Math.sin(this.v), this.e + Math.cos(this.v), 0,
        ]).scale(Math.sqrt(EARTH_MU / (this.a * (1 - Math.pow(this.e, 2)))));
        const rJ2k = rPqw.rot3(-this.w).rot1(-this.i).rot3(-this.o);
        const vJ2k = vPqw.rot3(-this.w).rot1(-this.i).rot3(-this.o);
        return new J2000(this.epoch, rJ2k, vJ2k);
    }
}
