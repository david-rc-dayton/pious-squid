import { EpochUTC } from "./time/epoch-utc";
import { Vector3D } from "./math/vector-3d";
import { Kepler } from "./propagators/kepler";
import { J2000 } from "./coordinates/j2000";
import { RungeKutta4 } from "./propagators/runge-kutta-4";

const state = new J2000(
  EpochUTC.fromDateString("2018-12-21T00:00:00.000Z"),
  new Vector3D(-1117.913276, 73.093299, -7000.018272),
  new Vector3D(3.531365461, 6.583914964, -0.495649656)
);

const prop = new RungeKutta4(state, {
  stepSize: 15,
  degree: 20,
  order: 20,
  gravityMoon: true,
  gravitySun: true
});
const result = prop.propagate(
  EpochUTC.fromDateString("2018-12-22T00:00:00.000Z")
);
const expected = new Vector3D(-212.125533, -2464.351601, 6625.907454);

console.log(result.position.toString());
console.log(expected.toString());
console.log(result.position.distance(expected));

const tNext = EpochUTC.fromDateString("2019-02-12T00:00:00.000Z");
const p1 = new Kepler(state.toClassicalElements());
p1.propagate(tNext);
console.log(p1.state.toString());
const p2 = new RungeKutta4(state, { stepSize: 5 });
p2.propagate(tNext);
console.log(p2.state.toString());
