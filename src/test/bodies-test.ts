import * as assert from "assert";
import {
  J2000,
  EpochUTC,
  MoonBody,
  SunBody,
  Vector3D,
  RungeKutta4Propagator,
  EarthBody
} from "../index";

const epoch = EpochUTC.fromDateString("2018-12-21T00:00:00.000Z");

const state = new J2000(
  epoch,
  new Vector3D(-1117.913276, 73.093299, -7000.018272),
  new Vector3D(3.531365461, 6.583914964, -0.495649656)
);

const rk4Prop = new RungeKutta4Propagator(state);

describe("MoonBody", () => {
  describe("position", () => {
    const actual = MoonBody.position(epoch);
    const expected = new Vector3D(
      154366.09642497,
      318375.615233499,
      109213.672184026
    );
    it("should be within 300km of real-world magnitude", () => {
      const magnitude = Math.abs(expected.magnitude() - actual.magnitude());
      assert(magnitude <= 300);
    });
    it("should be within 0.25 degrees of real-world angle", () => {
      const angle = expected.angle(actual) * (180 / Math.PI);
      assert(angle <= 0.25);
    });
  });
});

describe("SunBody", () => {
  describe("position", () => {
    const actual = SunBody.position(epoch);
    const expected = new Vector3D(
      -3092558.657913523,
      -134994294.84136814,
      -58520244.455122419
    );
    it("should be within 7000km of real-world magnitude", () => {
      const magnitude = Math.abs(expected.magnitude() - actual.magnitude());
      assert(magnitude <= 7000);
    });
    it("should be within 0.30 degrees of real-world angle", () => {
      const angle = expected.angle(actual) * (180 / Math.PI);
      assert(angle <= 0.3);
    });
  });

  describe("shadow", () => {
    rk4Prop.reset();
    rk4Prop.setStepSize(10);
    rk4Prop.forceModel.clearModel();
    rk4Prop.forceModel.setEarthGravity(0, 0);
    let propEpoch = epoch;
    let errorCount = 0;
    it("should approximately match inverted vector sight algorithm", () => {
      for (let i = 0; i < 1440; i++) {
        const satState = rk4Prop.propagate(propEpoch);
        const shadow = SunBody.shadow(satState);
        const satPos = satState.position;
        const sunPos = SunBody.position(propEpoch);
        const sight = satPos.sight(sunPos, EarthBody.RADIUS_MEAN);
        if (shadow === sight) {
          errorCount++;
        }
        propEpoch = propEpoch.roll(60);
      }
      assert(errorCount <= 3);
    });
  });
});
