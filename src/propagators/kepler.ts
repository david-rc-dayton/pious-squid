import { SEC2DAY, TWO_PI } from "../constants";
import { KeplerianElements } from "../coordinates/keplerian-elements";

export class Kepler {
    public initialElements: KeplerianElements;
    public cachedElements: KeplerianElements;

    constructor(elements: KeplerianElements) {
        this.initialElements = elements;
        this.cachedElements = elements;
    }

    public propagate(millis: number): KeplerianElements {
        const { epoch, a, e, i, o, w, v } = this.cachedElements;
        const delta = (millis / 1000) - epoch.unix;
        const [n, rev] = this.cachedElements.meanMotion();
        const k = Math.floor((delta * SEC2DAY) / rev);
        let EInit = Math.acos((e + Math.cos(v)) / (1 + e * Math.cos(v)));
        if (v > Math.PI) {
            EInit = TWO_PI - EInit;
        }
        const MInit = EInit - e * Math.sin(EInit);
        const MFut = (MInit + n * delta - 2 * k * Math.PI) % TWO_PI;
        let EFut = MFut;
        for (let iter = 0; iter < 16; iter++) {
            EFut = MFut + e * Math.sin(EFut);
        }
        let vFut = Math.acos((Math.cos(EFut) - e) / (1 - e * Math.cos(EFut)));
        if (EFut > Math.PI) {
            vFut = TWO_PI - vFut;
        }
        return new KeplerianElements(millis, a, e, i, o, w, vFut);
    }
}
