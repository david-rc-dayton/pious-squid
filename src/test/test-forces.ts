import { assert } from "chai";
import { Epoch } from "../epoch";
import * as forces from "../forces";
import { Vector } from "../vector";

const TEST_EPOCH = new Epoch(Date.UTC(2017, 5, 27, 7, 6, 33, 584));

const TEST_POSITION = new Vector(
    4.12853342060e4, 7.43471681700e3, -3.67624010600e3,
);

const TEST_VELOCITY = new Vector(
    -5.32810000000e-1, 3.03035500000e0, 1.05016000000e-1,
);

describe("forces", () => {
    describe("#j2Effect()", () => {
        it("should compute acceleration due to J2 effect", () => {
            const j2Acc = forces.j2Effect(TEST_POSITION);
            assert.deepEqual(j2Acc.state, [
                -7.89735779856068e-9,
                -1.4221664899661197e-9,
                2.1653716113911034e-9,
            ]);
        });
    });

    describe("#j3Effect()", () => {
        it("should compute acceleration due to J3 effect", () => {
            const j3Acc = forces.j3Effect(TEST_POSITION);
            assert.deepEqual(j3Acc.state, [
                -1.2469250342100464e-12,
                -2.245478860634352e-13,
                -2.7423810542307405e-12,
            ]);
        });
    });

    describe("#j4Effect()", () => {
        it("should compute acceleration due to J4 effect", () => {
            const j4Acc = forces.j4Effect(TEST_POSITION);
            assert.deepEqual(j4Acc.state, [
                -3.151407529719577e-13,
                -5.675095771665454e-14,
                1.513123852324999e-13,
            ]);
        });
    });

    describe("#gravityEarth()", () => {
        it("should compute acceleration due to Earth gravity", () => {
            const earthAcc = forces.earthSpherical(TEST_POSITION);
            assert.deepEqual(earthAcc.state, [
                -0.00022037980931088386,
                -0.00003968628342053639,
                0.000019623653510925474,
            ]);
        });
    });

    describe("#gravityMoon()", () => {
        it("should compute acceleration due to Moon gravity", () => {
            const moonAcc = forces.gravityMoon(TEST_EPOCH, TEST_POSITION);
            assert.deepEqual(moonAcc.state, [
                2.4118241499517503e-9,
                -4.928790594365748e-9,
                -1.526286361618321e-9,
            ]);
        });
    });

    describe("#gravitySun()", () => {
        it("should compute acceleration due to Sun gravity", () => {
            const sunAcc = forces.gravitySun(TEST_EPOCH, TEST_POSITION);
            assert.deepEqual(sunAcc.state, [
                -1.5708452032806065e-9,
                -1.642083599602331e-10,
                1.8915359419403605e-10,
            ]);
        });
    });

    describe("#solarRadiation()", () => {
        it("should compute acceleration due to solar radiation", () => {
            const srAcc = forces.solarRadiation(TEST_EPOCH, TEST_POSITION,
                1000, 1, 1.4);
            assert.deepEqual(srAcc.state, [
                -6.468125663392147e-13,
                5.788066976458911e-12,
                2.5094489571027267e-12,
            ]);
        });
    });

    describe("#atmosphericDrag()", () => {
        it("should compute acceleration due to atmospheric drag", () => {
            const adAcc = forces.atmosphericDrag(TEST_POSITION, TEST_VELOCITY,
                1000, 1, 2.2);
            assert.deepEqual(adAcc.state, [
                -1.7323209434508467e-74,
                -3.669569925336681e-74,
                -1.9481607545554463e-73,
            ]);
        });
    });
});
