import * as assert from "assert";
import { J2000 } from "../coordinates/j2000";
import { RungeKutta4 } from "../propagators/runge-kutta-4";
import { Vector } from "../vector";

const GEO_STATE_1 = new J2000(
    Date.UTC(2017, 5, 27, 7, 6, 33, 584),
    4.12853342060e4, 7.43471681700e3, -3.67624010600e3,
    -5.32810000000e-1, 3.03035500000e0, 1.05016000000e-1,
);

describe("RungeKutta4", () => {
    describe("#.propagate()", () => {
        it("should propagate geosynchronous satellites", () => {
            const rk4 = new RungeKutta4(GEO_STATE_1, 300);
            const { position } = rk4.propagate(
                Date.UTC(2017, 5, 28, 7, 6, 33, 584),
            );
            const dist = position.distance(
                new Vector(4.11526359989e4, 8.14874780238e3, -3.65210292647e3),
            ) * 1000;
            assert.ok(dist < 200, `Distance: ${dist.toFixed(2)} meters`);
        });
    });
});
