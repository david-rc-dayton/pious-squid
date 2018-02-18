import { J2000 } from '..'
import { Geodetic } from '../coordinates/geodetic'
import { LookAngle } from '../coordinates/look-angle'
import { IGroundStationOptions } from './construct-config'

/** Default construct options. */
const DEFAULT_OPTIONS: IGroundStationOptions = {
  minEl: 0,
  name: ''
}

/** Class representing a ground station. */
export class GroundStation {
  /** Ground station name. */
  public name: string
  /** Geodetic location of the ground station. */
  public location: Geodetic
  /** Site minimum elevation, in radians. */
  public minEl: number

  /**
   * Create a new GroundStation object. If values are not specified in the
   * options argument, the following defaults are used:
   *
   *     name  = ""
   *     minEl = 0
   *
   * @param location geodetic location of the ground station
   * @param opts ground station options
   */
  constructor (location: Geodetic, opts?: IGroundStationOptions) {
    this.location = location
    opts = opts || {}
    const mergeOpts = { ...DEFAULT_OPTIONS, ...opts }
    this.name = mergeOpts.name as string
    this.minEl = mergeOpts.minEl as number
  }

  /** Return a string representation of the object. */
  public toString (): string {
    return `Ground Station: ${this.name}\n` + location.toString()
  }

  /**
   * Calculate look angles for the ground station to a target state.
   *
   * @param state target state
   */
  public lookAngles (state: J2000): LookAngle {
    return state.toECI().toECEF()
      .toTopocentric(this.location).toLookAngle()
  }

  /**
   * Return true if a target state is in view, otherwise return false.
   *
   * @param state target state
   */
  public isVisible (state: J2000): boolean {
    const { elevation } = this.lookAngles(state)
    return elevation >= this.minEl
  }
}
