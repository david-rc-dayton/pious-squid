import * as assert from 'assert'
import { J2000 } from '../coordinates/j2000'
import { Kepler } from '../propagators/kepler'
import { RungeKutta4 } from '../propagators/runge-kutta-4'

const GEO_STATE_1 = [
  new J2000(Date.UTC(2017, 5, 27, 7, 6, 33, 584),
    4.12853342060e4, 7.43471681700e3, -3.67624010600e3,
    -5.32810000000e-1, 3.03035500000e0, 1.05016000000e-1),
  new J2000(Date.UTC(2017, 5, 27, 13, 6, 33, 584),
    -7.54402452534e3, 4.15051976949e4, 1.46135663491e3,
    -3.00934568722e0, -5.52507917363e-1, 2.67798152794e-1),
  new J2000(Date.UTC(2017, 5, 27, 19, 6, 33, 584),
    -4.13604755301e4, -7.62935881401e3, 3.68034831979e3,
    5.50737740226e-1, -3.01903793887e0, -1.06463779436e-1),
  new J2000(Date.UTC(2017, 5, 28, 7, 6, 33, 584),
    4.11526359989e4, 8.14874780238e3, -3.65210292647e3,
    -5.84795155962e-1, 3.02059500637e0, 1.09651877768e-1)
]

describe('RungeKutta4', () => {
  describe('#.propagate()', () => {
    const [GEO_0HR, GEO_6HR, GEO_12HR, GEO_24HR] = GEO_STATE_1
    const rk4 = new RungeKutta4(GEO_0HR, { stepSize: 300 })
    it('should have an error less than 50 meters after 6 hours', () => {
      const { position } = rk4.propagate(GEO_6HR.epoch.toMillis())
      const dist = position.distance(GEO_6HR.position) * 1000
      assert.ok(dist < 50, `Distance: ${dist.toFixed(2)} meters`)
    })
    it('should have an error less than 100 meters after 12 hours', () => {
      const { position } = rk4.propagate(GEO_12HR.epoch.toMillis())
      const dist = position.distance(GEO_12HR.position) * 1000
      assert.ok(dist < 100, `Distance: ${dist.toFixed(2)} meters`)
    })
    it('should have an error less than 200 meters after 24 hours', () => {
      const { position } = rk4.propagate(GEO_24HR.epoch.toMillis())
      const dist = position.distance(GEO_24HR.position) * 1000
      assert.ok(dist < 200, `Distance: ${dist.toFixed(2)} meters`)
    })
  })
})

describe('Kepler', () => {
  describe('#.step()', () => {
    it('should match numerical two-body results', () => {
      const state = new J2000(
        Date.UTC(2017, 10, 16, 0, 11, 30, 195),
        -3.86234943730e4, 1.68697633760e4, 1.00434444900e3,
        -1.231249e0, -2.810612e0, -2.01294e-1
      )
      const propRk = RungeKutta4.twoBody(state, { stepSize: 60 })
      const resultRk = propRk.step(
        Date.UTC(2017, 10, 16, 0, 11, 30, 195), 21600, 6
      )
      const propKep = new Kepler(state.toKeplerian())
      const resultKep = propKep.step(
        Date.UTC(2017, 10, 16, 0, 11, 30, 195), 21600, 6
      )
      for (let i = 0; i < resultRk.length; i++) {
        const dist = resultRk[i].position
          .distance(resultKep[i].position) * 1000
        assert.ok(dist < 1, `Distance: ${dist.toFixed(3)} meters`)
      }
    })
  })
})
