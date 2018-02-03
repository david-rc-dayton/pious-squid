import * as assert from "assert";
import { DEG2RAD, RAD2DEG } from "../constants";
import { EarthCenteredFixed } from "../coordinates/earth-centered-fixed";
import { Geodetic } from "../coordinates/geodetic";
import { J2000 } from "../coordinates/j2000";
import { Keplerian } from "../coordinates/keplerian";

const TEST_J2K = new J2000(0, 8228, 389, 6888, -0.7, 6.6, -0.6);

const TEST_KEPLER = new Keplerian(
    0,
    13360.642770119148,
    0.22049791840816513,
    DEG2RAD * 39.93754927254844,
    DEG2RAD * 269.85555147445865,
    DEG2RAD * 125.72438198841463,
    DEG2RAD * 326.46253415447933,
);

describe("J2000", () => {
    describe("#.toKeplerian()", () => {
        it("should convert to Keplerian elements", () => {
            const { epoch, a, e, i, o, w, v } = TEST_J2K.toKeplerian();
            assert.equal(epoch.unix, TEST_J2K.epoch.unix);
            assert.equal(a, 13360.642770119148);
            assert.equal(e, 0.22049791840816513);
            assert.equal(i * RAD2DEG, 39.93754927254844);
            assert.equal(o * RAD2DEG, 269.85555147445865);
            assert.equal(w * RAD2DEG, 125.72438198841463);
            assert.equal(v * RAD2DEG, 326.46253415447933);
        });
    });
});

describe("Keplerian", () => {
    describe("#.toJ2K()", () => {
        it("should convert to J2000 cartesian coordinates", () => {
            const { epoch, position, velocity } = TEST_KEPLER.toJ2K();
            assert.equal(epoch.unix, TEST_KEPLER.epoch.unix);
            assert.deepEqual(position.state, [
                8228, 389.0000000000039, 6888.000000000001,
            ]);
            assert.deepEqual(velocity.state, [
                -0.7000000000000014, 6.6000000000000005, -0.6000000000000014,
            ]);
        });
    });
});

describe("Topocentric", () => {
    describe("#.toLookAngle()", () => {
        it("should convert to look angles", () => {
            const center = new EarthCenteredFixed(42164, 0, 0)
                .toTopocentric(new Geodetic(0, 0, 0)).toLookAngle();
            assert.equal(center.azimuth * RAD2DEG, 180);
            assert.equal(center.elevation * RAD2DEG, 90);
            assert.equal(center.range, 35785.8637);
            const north = new EarthCenteredFixed(42164, 0, 0)
                .toTopocentric(new Geodetic(45 * DEG2RAD, 0, 0)).toLookAngle();
            assert.equal(north.azimuth * RAD2DEG, 180);
            assert.equal(north.elevation * RAD2DEG, 38.20257303057648);
            assert.equal(north.range, 37912.906092388876);
            const south = new EarthCenteredFixed(42164, 0, 0)
                .toTopocentric(new Geodetic(-45 * DEG2RAD, 0, 0)).toLookAngle();
            assert.equal(south.azimuth * RAD2DEG, 0);
            assert.equal(south.elevation * RAD2DEG, 38.20257303057648);
            assert.equal(south.range, 37912.906092388876);
            const east = new EarthCenteredFixed(42164, 0, 0)
                .toTopocentric(new Geodetic(0, 45 * DEG2RAD, 0)).toLookAngle();
            assert.equal(east.azimuth * RAD2DEG, 270);
            assert.equal(east.elevation * RAD2DEG, 38.16990789263988);
            assert.equal(east.range, 37923.10987953692);
            const west = new EarthCenteredFixed(42164, 0, 0)
                .toTopocentric(new Geodetic(0, -45 * DEG2RAD, 0)).toLookAngle();
            assert.equal(west.azimuth * RAD2DEG, 90);
            assert.equal(west.elevation * RAD2DEG, 38.16990789263988);
            assert.equal(west.range, 37923.10987953692);
        });
    });
});
