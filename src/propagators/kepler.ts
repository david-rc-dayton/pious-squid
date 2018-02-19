import { EARTH_J2, EARTH_RAD_EQ, SEC2DAY, TWO_PI } from '../constants'
import { J2000 } from '../coordinates/j2000'
import { KeplerianElements } from '../coordinates/keplerian-elements'
import { matchHalfPlane } from '../operations'
import {
  IKeplerModel, IPropagator, KeplerOptions, PropagatorType
} from './propagator-interface'

/** Default propagator model. */
const DEFAULT_MODEL: IKeplerModel = {
  atmosphericDrag: false,
  j2Effect: false,
  nDDot: 0,
  nDot: 0
}

/** Satellite ephemeris propagator, using Kepler's method. */
export class Kepler implements IPropagator {
  /** Propagator identifier string. */
  public type: PropagatorType
  /** Keplerian element set. */
  public elements: KeplerianElements
  /** Propagator force model. */
  public model: IKeplerModel
  /** Cache for last computed statellite state. */
  public state: J2000

  /**
   * Create a new Kepler propagator object. If values are not specified in
   * the model argument, the following options will be used:
   *
   *   nDot            = 0
   *   nDDot           = 0
   *   atmosphericDrag = false
   *   j2Effect        = false
   *
   * @param elements element set
   * @param model propagator options
   */
  constructor (elements: KeplerianElements, model?: KeplerOptions) {
    this.type = PropagatorType.KEPLER
    this.elements = elements
    this.state = elements.toJ2K()
    model = model || {}
    this.model = { ...DEFAULT_MODEL, ...model }
  }

  /** Return a string representation of the object. */
  public toString () {
    const { nDot, nDDot, atmosphericDrag, j2Effect } = this.model
    const status = (p: boolean) => p ? 'ENABLED' : 'DISABLED'
    return [
      '[Kepler]',
      `  1st Derivative of Mean Motion: ${nDot} rev/day^2`,
      `  2nd Derivative of Mean Motion: ${nDDot} rev/day^3`,
      `  Atmospheric Drag: ${status(atmosphericDrag)}`,
      `  J2 Effect: ${status(j2Effect)}`
    ].join('\n')
  }

  /**
   * Restore cached state to initial propagator state.
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
    const { nDot, nDDot } = this.model
    const delta = ((millis / 1000) - epoch.unix) * SEC2DAY
    const n = this.elements.meanMotion()
    let aDot = 0
    let eDot = 0
    if (this.model.atmosphericDrag) {
      aDot = -((2 * a) / (3 * n)) * nDot
      eDot = -((2 * (1 - e)) / (3 * n)) * nDot
    }
    let oDot = 0
    let wDot = 0
    if (this.model.j2Effect) {
      const j2Rad = Math.pow(EARTH_RAD_EQ / (a * (1 - e * e)), 2)
      oDot = -(3 / 2) * EARTH_J2 * j2Rad * Math.cos(i) * n * TWO_PI
      wDot = (3 / 4) * EARTH_J2 * j2Rad
        * (4 - 5 * Math.pow(Math.sin(i), 2)) * n * TWO_PI
    }
    const aFinal = a + aDot * delta
    const eFinal = e + eDot * delta
    const oFinal = o + oDot * delta
    const wFinal = w + wDot * delta
    let eeInit = Math.acos((e + Math.cos(v)) / (1 + e * Math.cos(v)))
    eeInit = matchHalfPlane(eeInit, v)
    let mInit = eeInit - e * Math.sin(eeInit)
    mInit = matchHalfPlane(mInit, eeInit)
    let mFinal = (mInit / TWO_PI)
      + n * delta
      + (nDot / 2) * Math.pow(delta, 2)
      + (nDDot / 6) * Math.pow(delta, 3)
    mFinal = (mFinal % 1) * TWO_PI
    let eeFinal = mFinal
    for (let iter = 0; iter < 16; iter++) {
      eeFinal = mFinal + eFinal * Math.sin(eeFinal)
    }
    let vFinal = Math.acos((Math.cos(eeFinal) - eFinal)
      / (1 - eFinal * Math.cos(eeFinal)))
    vFinal = matchHalfPlane(vFinal, eeFinal)
    this.state = new KeplerianElements(millis, aFinal, eFinal,
      i, oFinal, wFinal, vFinal).toJ2K()
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
