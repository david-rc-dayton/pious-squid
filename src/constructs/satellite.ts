import { EARTH_RAD_MEAN } from '../constants'
import { J2000 } from '../coordinates/j2000'
import { IPropagator } from '../propagators/propagator-interface'
import { ISatelliteOptions } from './construct-config'

/** Default construct options. */
const DEFAULT_OPTIONS: ISatelliteOptions = {
  name: ''
}

/** Class representing a satellite. */
export class Satellite {
  /** Satellite name. */
  public name: string
  /** Satellite ephemeris propagator. */
  public propagator: IPropagator

  /** Create a new Satellite object. If values are not specified in the
   * options argument, the following defaults are used:
   *
   *     name = ""
   *
   * @param propagator satellite ephemeris propagator
   * @param opts satellite options
   */
  constructor (propagator: IPropagator, opts?: ISatelliteOptions) {
    this.propagator = propagator
    opts = opts || {}
    const mergeOpts = { ...DEFAULT_OPTIONS, ...opts }
    this.name = mergeOpts.name as string
  }

  /** Return a string representation of the object. */
  public toString (): string {
    return [
      '[Satellite]',
      `  Name: ${this.name}`,
      `  Propagator: ${this.propagator.type}`
    ].join('\n')
  }

  /** Return the propagator's cached state. */
  public getState (): J2000 {
    return this.propagator.state
  }

  /** Calculate satellite footprint half-angle, in radians. */
  public calcFootprint (): number {
    const dist = this.propagator.state.position.magnitude()
    return Math.acos(EARTH_RAD_MEAN / dist)
  }

  /**
   * Propagate the satellite's state to a new epoch.
   *
   * @param millis milliseconds since 1 January 1970, 00:00 UTC
   */
  public propagate (millis: number): Satellite {
    this.propagator.propagate(millis)
    return this
  }
}
