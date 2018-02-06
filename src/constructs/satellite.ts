import { EarthCenteredFixed } from "../coordinates/earth-centered-fixed";
import { EarthCenteredInertial } from "../coordinates/earth-centered-inertial";
import { Geodetic } from "../coordinates/geodetic";
import { J2000 } from "../coordinates/j2000";
import { KeplerianElements } from "../coordinates/keplerian-elements";
import { Spherical } from "../coordinates/spherical";
import { IPropagator } from "../propagators/propagator-interface";
import { ISatelliteOptions } from "./construct-config";

export class Satellite {
    public name: string;
    public propagator: IPropagator;
    public state: J2000;

    constructor(propagator: IPropagator, opts?: ISatelliteOptions) {
        this.propagator = propagator;
        opts = opts || {};
        this.name = opts.name || "";
        this.state = propagator.propagate(this.propagator.millis);
    }

    public propagate(millis: number): Satellite {
        this.state = this.propagator.propagate(millis);
        return this;
    }

    public toECEF(): EarthCenteredFixed {
        return this.state.toECI().toECEF();
    }

    public toECI(): EarthCenteredInertial {
        return this.state.toECI();
    }

    public toGeodetic(): Geodetic {
        return this.state.toECI().toECEF().toGeodetic();
    }

    public toJ2K(): J2000 {
        return this.state;
    }

    public toKeplerian(): KeplerianElements {
        return this.state.toKeplerian();
    }

    public toSpherical(): Spherical {
        return this.state.toECI().toECEF().toSpherical();
    }
}

// const state = new J2000(0, 8228, 389, 6888, -0.7, 6.6, -0.6);
// const prop = RungeKutta4.twoBody(state);
// const state = new KeplerianElements(0, 13360.6, 0.220498, 39.9375 * DEG2RAD,
//     269.8556 * DEG2RAD, 125.7244 * DEG2RAD, 326.4625 * DEG2RAD);
// console.log(state.toJ2K().position);
// const prop = new Kepler(state, {
//     atmosphericDrag: true,
//     j2Effect: true,
//     nDot: 2 * 0.01017347,
// });
// const sat = new Satellite(prop, { name: "Test Satellite" });
// console.log(sat.state);
// sat.propagate(86400000);
// console.log(sat.state);
