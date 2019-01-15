import * as assert from "assert";
import {
  RungeKutta4Propagator,
  J2000,
  Vector3D,
  EpochUTC,
  KeplerPropagator
} from "../index";

const state = new J2000(
  EpochUTC.fromDateString("2018-12-21T00:00:00.000Z"),
  new Vector3D(-1117.913276, 73.093299, -7000.018272),
  new Vector3D(3.531365461, 6.583914964, -0.495649656)
);

const epoch = EpochUTC.fromDateString("2018-12-22T00:00:00.000Z");

const rk4Prop = new RungeKutta4Propagator(state);
const kepProp = new KeplerPropagator(state.toClassicalElements());

describe("KeplerPropagator", () => {
  describe("two-body", () => {
    rk4Prop.reset();
    rk4Prop.setStepSize(5);
    rk4Prop.forceModel.clearModel();
    rk4Prop.forceModel.setEarthGravity(0, 0);
    kepProp.reset();
    const rk4Result = rk4Prop.propagate(epoch).position;
    const kepResult = kepProp.propagate(epoch).position;
    it("should be within 1m of numerical two-body after 24 hours", () => {
      assert(kepResult.distance(rk4Result) < 0.001);
    });
  });
});

describe("RungeKutta4Propagator", () => {
  describe("high-accuracy", () => {
    rk4Prop.reset();
    rk4Prop.setStepSize(5);
    rk4Prop.forceModel.clearModel();
    rk4Prop.forceModel.setEarthGravity(50, 50);
    rk4Prop.forceModel.setThirdBody(true, true);
    const actual = rk4Prop.propagate(epoch).position;
    const expected = new Vector3D(-212.125533, -2464.351601, 6625.907454);
    it("should be within 25m of real-world ephemeris after 24 hours", () => {
      assert(expected.distance(actual) < 0.025);
    });
  });
});
