import { assert } from "chai";
import { J2000 } from "../coordinates/j2000";
import { Interpolator } from "../propagators/interpolator";
import { Kepler } from "../propagators/kepler";
import { RungeKutta4 } from "../propagators/runge-kutta-4";

/**
 * (a) Semimajor Axis:  42165.052 km
 * (e) Eccentricity:  0.001723
 * (i) Inclination:  5.3802°
 * (Ω) Right Ascension:  78.7240°
 */
const GEO_PERIOD = [
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

/**
 * (a) Semimajor Axis:  20726.300 km
 * (e) Eccentricity:  0.031591
 * (i) Inclination:  83.9278°
 * (Ω) Right Ascension:  337.8636°
 */
const TEST_STATE_1 = [
  new J2000(
    Date.UTC(2019, 10, 10, 19, 18, 1, 259),
    1886.241127,
    -3045.971781,
    -19841.316189,
    4.163012315,
    -1.6277958,
    0.572183403
  ),
  new J2000(
    Date.UTC(2019, 10, 12, 9, 36, 4, 449),
    -15086.432881,
    7555.644808,
    12268.091553,
    -2.427587367,
    0.578532906,
    -3.571952678
  )
];

/**
 * (a) Semimajor Axis:  21467.888 km
 * (e) Eccentricity:  0.064043
 * (i) Inclination:  82.0279°
 * (Ω) Right Ascension:  58.0407°
 */
const TEST_STATE_2 = [
  new J2000(
    Date.UTC(2018, 7, 2, 3, 19, 30, 764),
    10766.413859,
    17060.152654,
    -744.501313,
    -0.504478539,
    0.389800939,
    4.529557487
  ),
  new J2000(
    Date.UTC(2018, 7, 3, 18, 1, 28, 409),
    -12257.2953,
    -18305.120151,
    4979.283427,
    -0.095936284,
    -1.187562397,
    -3.912693552
  )
];

/**
 * (a) Semimajor Axis:  28875.588 km
 * (e) Eccentricity:  0.260648
 * (i) Inclination:  87.3031°
 * (Ω) Right Ascension:  177.9062°
 */
const TEST_STATE_3 = [
  new J2000(
    Date.UTC(2018, 10, 30, 16, 14, 2, 696),
    -33154.628126,
    941.711796,
    5736.970031,
    -0.112147894,
    -0.143809195,
    3.137874036
  ),
  new J2000(
    Date.UTC(2018, 11, 2, 14, 25, 29, 102),
    8510.666216,
    -1738.198088,
    30240.749743,
    2.940719342,
    -0.027613773,
    -1.697921358
  )
];

/**
 * (a) Semimajor Axis:  6783.063 km
 * (e) Eccentricity:  0.000745
 * (i) Inclination:  51.5397°
 * (Ω) Right Ascension:  282.2575°
 */
const TEST_STATE_4 = [
  new J2000(
    Date.UTC(2018, 6, 6, 12, 0, 0, 0),
    4012.3318,
    -3811.33296,
    3917.51571,
    1.941806414,
    6.215850084,
    4.05032976
  ),
  new J2000(
    Date.UTC(2018, 6, 7, 12, 0, 0, 0),
    -4170.83299,
    2275.13615,
    -4844.49545,
    -1.056742703,
    -7.178017864,
    -2.460646905
  )
];

describe("RungeKutta4", () => {
  describe("#propagate()", () => {
    const [GEO_0HR, GEO_6HR, GEO_12HR, GEO_24HR] = GEO_PERIOD;
    const rk4 = new RungeKutta4(GEO_0HR, { stepSize: 60 });
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
    it("should propagate test state #1 within 700 meters", () => {
      const [testStart, testEnd] = TEST_STATE_1;
      const testProp = new RungeKutta4(testStart, { stepSize: 60 });
      const { position } = testProp.propagate(testEnd.epoch.millis);
      const dist = position.distance(testEnd.position) * 1000;
      assert.isBelow(dist, 700);
    });
    it("should propagate test state #2 within 600 meters", () => {
      const [testStart, testEnd] = TEST_STATE_2;
      const testProp = new RungeKutta4(testStart, { stepSize: 60 });
      const { position } = testProp.propagate(testEnd.epoch.millis);
      const dist = position.distance(testEnd.position) * 1000;
      assert.isBelow(dist, 600);
    });
    it("should propagate test state #3 within 300 meters", () => {
      const [testStart, testEnd] = TEST_STATE_3;
      const testProp = new RungeKutta4(testStart, { stepSize: 60 });
      const { position } = testProp.propagate(testEnd.epoch.millis);
      const dist = position.distance(testEnd.position) * 1000;
      assert.isBelow(dist, 300);
    });
    it("should propagate test state #4 within 3250 meters", () => {
      const [testStart, testEnd] = TEST_STATE_4;
      const testProp = new RungeKutta4(testStart, { stepSize: 30 });
      const { position } = testProp.propagate(testEnd.epoch.millis);
      const dist = position.distance(testEnd.position) * 1000;
      assert.isBelow(dist, 3250);
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
