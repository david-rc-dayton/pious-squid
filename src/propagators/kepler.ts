import { EARTH_J2, EARTH_RAD_EQ, SEC2DAY, TWO_PI } from "../constants";
import { KeplerianElements } from "../coordinates/keplerian-elements";

export class Kepler {
    public initialElements: KeplerianElements;
    public cachedElements: KeplerianElements;
    public nDot: number;
    public nDDot: number;

    constructor(elements: KeplerianElements, nDot = 0, nDDot = 0) {
        this.initialElements = elements;
        this.cachedElements = elements;
        this.nDot = nDot;
        this.nDDot = nDDot;
    }

    public propogate(millis: number): KeplerianElements {
        // aDrag, eDrag, oJ2, wJ2
        const { epoch, a, e, i, o, w, v } = this.cachedElements;
        const { nDot, nDDot } = this;
        const delta = ((millis / 1000) - epoch.unix) * SEC2DAY;
        const n = this.cachedElements.meanMotion();
        const aDot = -((2 * a) / (3 * n)) * nDot;
        const eDot = -((2 * (1 - e)) / (3 * n)) * nDot;
        const j2Rad = Math.pow(EARTH_RAD_EQ / (a * (1 - e * e)), 2);
        const oDot = -(3 / 2) * EARTH_J2 * j2Rad * Math.cos(i) * n * TWO_PI;
        const wDot = (3 / 4) * EARTH_J2 * j2Rad
            * (4 - 5 * Math.pow(Math.sin(i), 2)) * n * TWO_PI;
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
        return new KeplerianElements(millis, aFinal, eFinal, i, oFinal,
            wFinal, vFinal);
    }
}

// const els = new KeplerianElements(Date.UTC(2010, 2, 10, 22, 53, 14, 697),
//     7792.181, 0.1287762, 100.5570 * DEG2RAD, 211.8106 * DEG2RAD,
//     211.3101 * DEG2RAD, 148.7972 * DEG2RAD);
// new Kepler(els, 2 * 0.01017347)
//     .propogate(Date.UTC(2010, 2, 11, 22, 53, 14, 697));
