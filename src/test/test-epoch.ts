import { assert } from 'chai'
import { Epoch } from '../epoch'

describe('Epoch', () => {
  const testEpoch = new Epoch(Date.UTC(2017, 5, 27, 7, 6, 33, 584))

  describe('#roll()', () => {
    it('should change the epoch time', () => {
      const epRoll = testEpoch.roll(86400)
      assert.equal(epRoll.unix, 1498633593.584)
    })
  })

  describe('#toJulianDate()', () => {
    it('should calculate the Julian Date', () => {
      assert.equal(testEpoch.toJulianDate(), 2457931.796222037)
    })
  })

  describe('#getLeapSecondOffset()', () => {
    it('should return the leap-second offset', () => {
      assert.equal(testEpoch.getLeapSecondOffset(), 37)
    })
  })

  describe('#toTerrestrialCenturies()', () => {
    it('should calculate Terrestrial Centuries', () => {
      assert.equal(testEpoch.toTerrestrialCenturies(),
        0.17486097256065913)
    })
  })

  describe('#toJulianCenturies()', () => {
    it('should calculate Julian Centuries', () => {
      assert.equal(testEpoch.toJulianCenturies(),
        0.17486095063756796)
    })
  })

  describe('#getGMSTAngle()', () => {
    it('should calculate the GMST angle', () => {
      assert.equal(testEpoch.getGMSTAngle(),
        0.38797689926765666)
    })
  })
})
