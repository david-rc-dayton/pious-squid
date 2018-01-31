import { Epoch } from '../epoch'

export class Keplerian {
    public epoch: Epoch
    public a: number
    public e: number
    public i: number
    public o: number
    public w: number
    public v: number

    constructor(epoch: Epoch, a: number, e: number, i: number,
        o: number, w: number, v: number) {
        this.epoch = epoch
        this.a = a
        this.e = e
        this.i = i
        this.o = o
        this.w = w
        this.v = v
    }
}