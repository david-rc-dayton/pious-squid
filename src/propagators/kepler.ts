import { EARTH_J2, EARTH_RAD_EQ, SEC2DAY, TWO_PI } from "../constants";
import { J2000 } from "../coordinates/j2000";
import { KeplerianElements } from "../coordinates/keplerian-elements";
import { IKeplerModel, IPropagator } from "./propagator-interface";

/** Satellite ephemeris propagator, using Kepler's method. */
export class Kepler implements IPropagator {
    /** Keplerian element set. */
    public elements: KeplerianElements;
    /** First derivative of mean motion, in revolutions/day^2. */
    public nDot: number;
    /** Second derivative of mean motion, in revolutions/day^3. */
    public nDDot: number;
    /** Model effects of atmospheric drag, if true. */
    public atmosphericDrag: boolean;
    /** Model J2 effect, if true. */
    public j2Effect: boolean;

    constructor(elements: KeplerianElements, model: IKeplerModel) {
        this.elements = elements;
        this.nDot = model.nDot || 0;
        this.nDDot = model.nDDot || 0;
        this.atmosphericDrag = model.atmosphericDrag || false;
        this.j2Effect = model.j2Effect || false;
    }

    public propagate(millis: number): J2000 {
        // aDrag, eDrag, oJ2, wJ2
        const { epoch, a, e, i, o, w, v } = this.elements;
        const { nDot, nDDot } = this;
        const delta = ((millis / 1000) - epoch.unix) * SEC2DAY;
        const n = this.elements.meanMotion();
        let aDot = 0;
        let eDot = 0;
        if (this.atmosphericDrag) {
            aDot = -((2 * a) / (3 * n)) * nDot;
            eDot = -((2 * (1 - e)) / (3 * n)) * nDot;
        }
        let oDot = 0;
        let wDot = 0;
        if (this.j2Effect) {
            const j2Rad = Math.pow(EARTH_RAD_EQ / (a * (1 - e * e)), 2);
            oDot = -(3 / 2) * EARTH_J2 * j2Rad * Math.cos(i) * n * TWO_PI;
            wDot = (3 / 4) * EARTH_J2 * j2Rad
                * (4 - 5 * Math.pow(Math.sin(i), 2)) * n * TWO_PI;
        }
        const aFinal = a + aDot * delta;
        const eFinal = e + eDot * delta;
        const oFinal = o + oDot * delta;
        const wFinal = w + wDot * delta;
        let EInit = Math.acos((e + Math.cos(v)) / (1 + e * Math.cos(v)));
        if (v > Math.PI) {
            EInit = TWO_PI - EInit;
        }
        const M = EInit - e * Math.sin(EInit);
        let MFinal = (M / TWO_PI) + n * delta + (nDot / 2)
            * Math.pow(delta, 2) + (nDDot / 6) * Math.pow(delta, 3);
        MFinal = (MFinal % 1) * TWO_PI;
        let EFinal = 0;
        for (let iter = 0; iter < 16; iter++) {
            EFinal = MFinal + eFinal * Math.sin(EFinal);
        }
        const vFinal = Math.acos((Math.cos(EFinal) - eFinal)
            / (1 - eFinal * Math.cos(EFinal)));
        return new KeplerianElements(millis, aFinal, eFinal,
            i, oFinal, wFinal, vFinal).toJ2K();
    }
}

// const els = new KeplerianElements(Date.UTC(2010, 2, 10, 22, 53, 14, 697),
//     7792.181, 0.1287762, 100.5570 * DEG2RAD, 211.8106 * DEG2RAD,
//     211.3101 * DEG2RAD, 148.7972 * DEG2RAD);
// console.log(new Kepler(els, {
//     atmosphericDrag: true,
//     j2Effect: true,
//     nDot: 2 * 0.01017347,
// }).propogate(Date.UTC(2010, 2, 11, 22, 53, 14, 697)).toJ2K());
