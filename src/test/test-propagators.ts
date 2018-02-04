import * as assert from "assert";
import { J2000 } from "../coordinates/j2000";
import { RungeKutta4 } from "../propagators/runge-kutta-4";

const GEO_STATE_1 = [
    new J2000(Date.UTC(2017, 5, 27, 7, 6, 33, 584),
        4.12853342060e4, 7.43471681700e3, -3.67624010600e3,
        -5.32810000000e-1, 3.03035500000e0, 1.05016000000e-1),
    new J2000(Date.UTC(2017, 5, 27, 13, 6, 33, 584),
        -7.54402452534e3, 4.15051976949e4, 1.46135663491e3,
        -3.00934568722e0, -5.52507917363e-1, 2.67798152794e-1),
    new J2000(Date.UTC(2017, 5, 27, 19, 6, 33, 584),
        -4.13604755301e4, -7.62935881401e3, 3.68034831979e3,
        5.50737740226e-1, -3.01903793887e0, -1.06463779436e-1),
    new J2000(Date.UTC(2017, 5, 28, 1, 6, 33, 584),
        7.67012525578e3, -4.13874189375e4, -1.47082825564e3,
        3.01260938022e0, 5.71966398298e-1, -2.67793178113e-1),
    new J2000(Date.UTC(2017, 5, 28, 7, 6, 33, 584),
        4.11526359989e4, 8.14874780238e3, -3.65210292647e3,
        -5.84795155962e-1, 3.02059500637e0, 1.09651877768e-1),
];

describe("RungeKutta4", () => {
    describe("#.propagate()", () => {
        it("should have an error less than 50 meters over 6 hours", () => {
            for (let i = 0; i < GEO_STATE_1.length - 1; i++) {
                const rk4 = new RungeKutta4(GEO_STATE_1[i]);
                const { position } = rk4.propagate(
                    GEO_STATE_1[i + 1].epoch.toMillis(),
                );
                const dist = position.distance(
                    GEO_STATE_1[i + 1].position,
                ) * 1000;
                assert.ok(dist < 50, `Distance: ${dist.toFixed(2)} meters`);
            }
        });
        it("should have an error less than 100 meters over 12 hours", () => {
            for (let i = 0; i < GEO_STATE_1.length - 2; i += 2) {
                const rk4 = new RungeKutta4(GEO_STATE_1[i]);
                const { position } = rk4.propagate(
                    GEO_STATE_1[i + 2].epoch.toMillis(),
                );
                const dist = position.distance(
                    GEO_STATE_1[i + 2].position,
                ) * 1000;
                assert.ok(dist < 100, `Distance: ${dist.toFixed(2)} meters`);
            }
        });
        it("should have an error less than 200 meters over 24 hours", () => {
            const rk4 = new RungeKutta4(GEO_STATE_1[0]);
            const { position } = rk4.propagate(
                GEO_STATE_1[4].epoch.toMillis(),
            );
            const dist = position.distance(GEO_STATE_1[4].position) * 1000;
            assert.ok(dist < 200, `Distance: ${dist.toFixed(2)} meters`);
        });
    });
});
