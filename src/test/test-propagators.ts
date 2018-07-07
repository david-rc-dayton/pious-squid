import { assert } from "chai";
import { J2000 } from "../coordinates/j2000";
import { Interpolator } from "../propagators/interpolator";
import { Kepler } from "../propagators/kepler";
import { RungeKutta4 } from "../propagators/runge-kutta-4";

const GEO_STATE_1 = [
  new J2000(
    Date.UTC(2017, 5, 27, 7, 6, 33, 584),
    4.1285334206e4,
    7.434716817e3,
    -3.676240106e3,
    -5.3281e-1,
    3.030355,
    1.05016e-1
  ),
  new J2000(
    Date.UTC(2017, 5, 27, 13, 6, 33, 584),
    -7.54402452534e3,
    4.15051976949e4,
    1.46135663491e3,
    -3.00934568722,
    -5.52507917363e-1,
    2.67798152794e-1
  ),
  new J2000(
    Date.UTC(2017, 5, 27, 19, 6, 33, 584),
    -4.13604755301e4,
    -7.62935881401e3,
    3.68034831979e3,
    5.50737740226e-1,
    -3.01903793887,
    -1.06463779436e-1
  ),
  new J2000(
    Date.UTC(2017, 5, 28, 7, 6, 33, 584),
    4.11526359989e4,
    8.14874780238e3,
    -3.65210292647e3,
    -5.84795155962e-1,
    3.02059500637,
    1.09651877768e-1
  )
];

describe("RungeKutta4", () => {
  describe("#propagate()", () => {
    const [GEO_0HR, GEO_6HR, GEO_12HR, GEO_24HR] = GEO_STATE_1;
    const rk4 = new RungeKutta4(GEO_0HR, { stepSize: 300 });
    it("should have an error less than 50 meters after 6 hours", () => {
      const { position } = rk4.propagate(GEO_6HR.epoch.millis);
      const dist = position.distance(GEO_6HR.position) * 1000;
      assert.isBelow(dist, 50);
    });
    it("should have an error less than 100 meters after 12 hours", () => {
      const { position } = rk4.propagate(GEO_12HR.epoch.millis);
      const dist = position.distance(GEO_12HR.position) * 1000;
      assert.isBelow(dist, 100);
    });
    it("should have an error less than 200 meters after 24 hours", () => {
      const { position } = rk4.propagate(GEO_24HR.epoch.millis);
      const dist = position.distance(GEO_24HR.position) * 1000;
      assert.isBelow(dist, 200);
    });
  });
});

describe("Kepler", () => {
  describe("#step()", () => {
    it("should match numerical two-body results", () => {
      const state = new J2000(
        Date.UTC(2017, 10, 16, 0, 11, 30, 195),
        -3.8623494373e4,
        1.6869763376e4,
        1.004344449e3,
        -1.231249,
        -2.810612,
        -2.01294e-1
      );
      const propRk = RungeKutta4.twoBody(state, { stepSize: 300 });
      const resultRk = propRk.step(
        Date.UTC(2017, 10, 16, 0, 11, 30, 195),
        21600,
        6
      );
      const propKep = new Kepler(state.toKeplerian());
      const resultKep = propKep.step(
        Date.UTC(2017, 10, 16, 0, 11, 30, 195),
        21600,
        6
      );
      for (let i = 0; i < resultRk.length; i++) {
        const dist =
          resultRk[i].position.distance(resultKep[i].position) * 1000;
        assert.isBelow(dist, 5);
      }
    });
  });
});

describe("Interpolator", () => {
  describe("#propagate()", () => {
    const state = new J2000(
      Date.UTC(2017, 10, 16, 0, 11, 30, 195),
      -3.8623494373e4,
      1.6869763376e4,
      1.004344449e3,
      -1.231249,
      -2.810612,
      -2.01294e-1
    );
    const rk4 = new RungeKutta4(state);
    const j2ks = rk4.step(Date.UTC(2017, 10, 17), 900, 96);
    rk4.reset();
    const expected = rk4.step(Date.UTC(2017, 10, 17), 60, 1440);
    const interpLinear = new Interpolator(j2ks, { method: "linear" });
    const interpVerlet = new Interpolator(j2ks, { method: "verlet" });
    it("should be within 25km of expected using the linear method", () => {
      expected.forEach(element => {
        const actual = interpLinear.propagate(element.epoch.millis);
        const dist = actual.position.distance(element.position);
        assert.isBelow(dist, 50);
      });
    });
    it("should be within 5m of expected using the Verlet method", () => {
      expected.forEach(element => {
        const actual = interpVerlet.propagate(element.epoch.millis);
        const dist = actual.position.distance(element.position) * 1000;
        assert.isBelow(dist, 10);
      });
    });
    it("should throw RangeError if outside data range", () => {
      assert.throws(() => {
        interpVerlet.propagate(Date.UTC(2017, 10, 16, 23, 59, 59, 999));
      }, RangeError);
      assert.throws(() => {
        interpVerlet.propagate(Date.UTC(2017, 10, 18, 0, 0, 0, 1));
      }, RangeError);
    });
  });
});
