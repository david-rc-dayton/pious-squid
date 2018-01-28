import * as bodies from '../bodies'
import * as assert from 'assert'
import { Epoch } from '../epoch'
import { Vector } from '../vector';

describe('bodies', function () {
    let testEpoch = new Epoch(Date.UTC(2017, 5, 27, 7, 6, 33, 584))
    let testPosition = new Vector([
        4.12853342060e4, 7.43471681700e3, -3.67624010600e3
    ])

    describe('#precession()', function () {
        it("should calculate precession angles", function () {
            let pVals = bodies.precession(testEpoch)
            assert.deepEqual(pVals, [
                0.0019551413267373313,
                0.0016990899951803613,
                0.0019552588475936637
            ])
        })
    })

    describe('#nutation()', function () {
        it("should calculate nutation angles", function () {
            let nVals = bodies.nutation(testEpoch)
            assert.deepEqual(nVals, [
                -0.00004379744379460419,
                -0.00004024870006662178,
                0.4090531153388292
            ])
        })
    })

    describe('#atmosphericDensity()', function () {
        it("should return atmospheric density", function () {
            let aDens = bodies.atmosphericDensity(testPosition)
            assert.equal(aDens, 1.5721664203116942e-71)
        })
    })

    describe('#moonPosition()', function () {
        it("should return the position of the Moon", function () {
            let moonPos = bodies.moonPosition(testEpoch)
            assert.deepEqual(moonPos.state, [
                -282809.2858974682,
                220295.82569754496,
                91509.42449112915
            ])
        })
    })

    describe('#sunPosition()', function () {
        it("should return the position of the Sun", function () {
            let sunPos = bodies.sunPosition(testEpoch)
            assert.deepEqual(sunPos.state, [
                -15469334.826931607,
                138805771.37745005,
                60173122.43849363
            ])
        })
    })
})