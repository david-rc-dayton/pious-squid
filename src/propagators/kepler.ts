import { TWO_PI } from '../constants'
import { J2000 } from '../coordinates/j2000'
import { KeplerianElements } from '../coordinates/keplerian-elements'
import { matchHalfPlane } from '../operations'
import { Propagator, PropagatorType } from './propagator-interface'

/** Satellite ephemeris propagator, using Kepler's method. */
export class Kepler implements Propagator {
  /** Propagator identifier string. */
  public readonly type: string
  /** Cache for last computed statellite state. */
  public state: J2000
  /** Keplerian element set. */
  private readonly elements: KeplerianElements

  /**
   * Create a new Kepler propagator object. This propagator only models
   * two-body effects on the orbiting object.
   *
   * @param elements Keplerian element set
   */
  constructor (elements: KeplerianElements) {
    this.type = PropagatorType.KEPLER
    this.elements = elements
    this.state = elements.toJ2K()
  }

  /** Return a string representation of the object. */
  public toString () {
    return '[Kepler]:  Two-Body Propagator'
  }

  /**
   * Restore cached state to initial propagator state. Doesn't really do much
   * for the Kepler propagator, since it doesn't rely on transient states.
   */
  public reset (): Kepler {
    this.state = this.elements.toJ2K()
    return this
  }

  /**
   * Propagate satellite state to a new epoch.
   *
   * @param millis milliseconds since 1 January 1970, 00:00 UTC
   */
  public propagate (millis: number): J2000 {
    const { epoch, a, e, i, o, w, v } = this.elements
    const delta = (millis / 1000) - epoch.unix
    const n = this.elements.meanMotion()
    let eaInit = Math.acos((e + Math.cos(v)) / (1 + e * Math.cos(v)))
    eaInit = matchHalfPlane(eaInit, v)
    let maInit = eaInit - e * Math.sin(eaInit)
    maInit = matchHalfPlane(maInit, eaInit)
    const maFinal = (maInit + n * delta) % TWO_PI
    let eaFinal = maFinal
    for (let iter = 0; iter < 32; iter++) {
      const eaTemp = maFinal + e * Math.sin(eaFinal)
      if (Math.abs(eaTemp - eaFinal) < 1e-12) break
      eaFinal = eaTemp
    }
    let vFinal = Math.acos((Math.cos(eaFinal) - e)
      / (1 - e * Math.cos(eaFinal)))
    vFinal = matchHalfPlane(vFinal, eaFinal)
    this.state = new KeplerianElements(millis, a, e, i, o, w, vFinal).toJ2K()
    return this.state
  }

  /**
   * Propagate state by some number of seconds, repeatedly, starting at a
   * specified epoch.
   *
   * @param millis propagation start time
   * @param interval seconds between output states
   * @param count number of steps to take
   */
  public step (millis: number, interval: number, count: number): J2000[] {
    const output: J2000[] = [this.propagate(millis)]
    let tempEpoch = millis
    for (let i = 0; i < count; i++) {
      tempEpoch += interval * 1000
      output.push(this.propagate(tempEpoch))
    }
    return output
  }
}
