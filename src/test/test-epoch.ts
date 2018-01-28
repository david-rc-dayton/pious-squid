import { Epoch } from '../epoch'
import * as assert from 'assert'

describe('Epoch', function () {
    let testEpoch = new Epoch(Date.UTC(2017, 5, 27, 7, 6, 33, 584))

    describe("#roll()", function () {
        it("should change the epoch time", function () {
            let epRoll = testEpoch.roll(86400)
            assert.equal(epRoll.epoch, 1498633593.584)
        })
    })

    describe("#toJulianDate()", function () {
        it("should calculate the Julian Date", function () {
            assert.equal(testEpoch.toJulianDate(), 2457931.796222037)
        })
    })

    describe("#getLeapSecondOffset()", function () {
        it("should return the leap-second offset", function () {
            assert.equal(testEpoch.getLeapSecondOffset(), 37)
        })
    })

    describe("#toTerrestrialCenturies()", function () {
        it("should calculate Terrestrial Centuries", function () {
            assert.equal(testEpoch.toTerrestrialCenturies(),
                0.17486097256065913)
        })
    })

    describe("#toJulianCenturies()", function () {
        it("should calculate Julian Centuries", function () {
            assert.equal(testEpoch.toJulianCenturies(),
                0.17486095063756796)
        })
    })

    describe("#getGMSTAngle()", function () {
        it("should calculate the GMST angle", function () {
            assert.equal(testEpoch.getGMSTAngle(),
                0.38797689926765666)
        })
    })
})
