import { assert } from 'chai'
import { RAD2DEG } from '../constants'
import { Satellite } from '../constructs/satellite'
import { J2000 } from '../coordinates/j2000'
import { RungeKutta4 } from '../propagators/runge-kutta-4'

describe('Satellite', () => {
  describe('#calcFootprint()', () => {
    it('should calculate swath angle using cached state', () => {
      const state = new J2000(0, 42164, 0, 0, 0, 0, 0)
      const satellite = new Satellite(new RungeKutta4(state))
      const footprint = satellite.calcFootprint() * RAD2DEG
      assert.equal(footprint, 81.30928342062306)
    })
  })
})
