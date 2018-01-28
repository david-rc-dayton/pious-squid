import * as forces from '../forces'
import { Vector } from '../vector'
import { Epoch } from '../epoch'
import * as assert from 'assert'
import { J2000 } from '../coordinates/j2000';

const TEST_EPOCH = new Epoch(Date.UTC(2017, 5, 27, 7, 6, 33, 584))

const TEST_POSITION = new Vector([
    4.12853342060e4, 7.43471681700e3, -3.67624010600e3
])

const TEST_VELOCITY = new Vector([
    -5.32810000000e-1, 3.03035500000e0, 1.05016000000e-1
])

describe('forces', function () {
    describe('#j2Effect()', function () {
        it("should compute acceleration due to J2 effect", function () {
            let j2Acc = forces.j2Effect(TEST_POSITION)
            assert.deepEqual(j2Acc.state, [
                -7.89735779856068e-9,
                -1.4221664899661197e-9,
                2.1653716113911034e-9
            ])
        })
    })

    describe('#j3Effect()', function () {
        it("should compute acceleration due to J3 effect", function () {
            let j3Acc = forces.j3Effect(TEST_POSITION)
            assert.deepEqual(j3Acc.state, [
                -1.2469250342100464e-12,
                -2.245478860634352e-13,
                -2.7423810542307405e-12
            ])
        })
    })

    describe('#j4Effect()', function () {
        it("should compute acceleration due to J4 effect", function () {
            let j4Acc = forces.j4Effect(TEST_POSITION)
            assert.deepEqual(j4Acc.state, [
                -3.151407529719577e-13,
                -5.675095771665454e-14,
                1.513123852324999e-13
            ])
        })
    })

    describe('#gravityEarth()', function () {
        it("should compute acceleration due to Earth gravity", function () {
            let earthAcc = forces.gravityEarth(TEST_POSITION)
            assert.deepEqual(earthAcc.state, [
                -0.00022037980931088386,
                -0.00003968628342053639,
                0.000019623653510925474
            ])
        })
    })

    describe('#gravityMoon()', function () {
        it("should compute acceleration due to Moon gravity", function () {
            let moonAcc = forces.gravityMoon(TEST_EPOCH, TEST_POSITION)
            assert.deepEqual(moonAcc.state, [
                2.4118241499517503e-9,
                -4.928790594365748e-9,
                -1.526286361618321e-9
            ])
        })
    })

    describe('#gravitySun()', function () {
        it("should compute acceleration due to Sun gravity", function () {
            let sunAcc = forces.gravitySun(TEST_EPOCH, TEST_POSITION)
            assert.deepEqual(sunAcc.state, [
                -1.5708452032806065e-9,
                -1.642083599602331e-10,
                1.8915359419403605e-10
            ])
        })
    })

    describe('#solarRadiation()', function () {
        it("should compute acceleration due to solar radiation", function () {
            let srAcc = forces.solarRadiation(TEST_EPOCH, TEST_POSITION)
            assert.deepEqual(srAcc.state, [
                6.259125160767262e-13,
                -5.6010407852157446e-12,
                -2.4283627011082955e-12
            ])
        })
    })

    describe('#atmosphericDrag()', function () {
        it("should compute acceleration due to atmospheric drag", function () {
            let adAcc = forces.atmosphericDrag(TEST_POSITION, TEST_VELOCITY)
            assert.deepEqual(adAcc.state, [
                -1.7323209434508467e-74,
                -3.669569925336681e-74,
                -1.9481607545554463e-73
            ])
        })
    })

    describe('#derivative()', function () {
        it("should compute position and velocity derivative", function () {
            let j2kState = new J2000(TEST_EPOCH, TEST_POSITION, TEST_VELOCITY)
            let deriv = forces.derivative(j2kState)
            assert.deepEqual(deriv.state, [
                -0.53281,
                3.030355,
                0.105016,
                -0.00022038686662588904,
                -0.000039692804468320307,
                0.000019624476730338078
            ])
        })
    })
})