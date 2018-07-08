import { assert } from "chai";
import * as bodies from "../bodies";
import { Epoch } from "../epoch";
import { Vector } from "../vector";

describe("bodies", () => {
  const testEpoch = new Epoch(Date.UTC(2017, 5, 27, 7, 6, 33, 584));
  const testPosition = new Vector(
    4.1285334206e4,
    7.434716817e3,
    -3.676240106e3
  );

  describe("#precession()", () => {
    it("should calculate precession angles", () => {
      const pVals = bodies.precession(testEpoch);
      assert.deepEqual(pVals, [
        0.0019551413267373313,
        0.0016990899951803613,
        0.0019552588475936637
      ]);
    });
  });

  describe("#nutation()", () => {
    it("should calculate nutation angles", () => {
      const nVals = bodies.nutation(testEpoch);
      assert.deepEqual(nVals, [
        -0.000043867325425733865,
        -0.000040239886445427816,
        0.4090531153388292
      ]);
    });
  });

  describe("#atmosphericDensity()", () => {
    it("should return atmospheric density", () => {
      const aDens = bodies.atmosphericDensity(testPosition);
      assert.equal(aDens, 1.5721664203116942e-71);
    });
  });

  describe("#moonPosition()", () => {
    it("should return the position of the Moon", () => {
      const moonPos = bodies.moonPosition(testEpoch);
      assert.deepEqual(moonPos.state, [
        -282809.2858974682,
        220295.82569754496,
        91509.42449112915
      ]);
    });
  });

  describe("#sunPosition()", () => {
    it("should return the position of the Sun", () => {
      const sunPos = bodies.sunPosition(testEpoch);
      assert.deepEqual(sunPos.state, [
        -15469334.826931607,
        138805771.37745005,
        60173122.43849363
      ]);
    });
  });
});
