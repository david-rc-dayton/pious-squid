import { J2000 } from '../coordinates/j2000'
import { gravityEarth } from '../forces'
import { linearInterpolate, sign } from '../operations'
import { Vector } from '../vector'
import {
  IInterpolatorModel, InterpolatorMethods, InterpolatorOptions,
  IPropagator, PropagatorType
} from './propagator-interface'

/** Closure used for interpolation. */
export type InterpClosure = (millis: number) => J2000

/** Default interpolator model. */
const DEFAULT_MODEL: IInterpolatorModel = {
  method: InterpolatorMethods.VERLET,
  stepSize: 60
}

/**
 * Create a closure for interpolating new states, using the Verlet method, from
 * constructor data.
 *
 * @param states a list of J2000 states
 * @param stepSize step size, in seconds
 */
function closureVerlet (states: J2000[], stepSize: number): InterpClosure {
  type Internal = [number, Vector, Vector]
  const cache: Internal[] = []
  for (let i = 0; i < states.length; i++) {
    const element = states[i]
    cache.push([element.epoch.toMillis(), element.position, element.velocity])
  }
  return (millis: number): J2000 => {
    let state = cache[0]
    cache.forEach(element => {
      const [elEpoch, crEpoch] = [element[0], state[0]]
      if (Math.abs(millis - elEpoch) < Math.abs(millis - crEpoch)) {
        state = element
      }
    })
    while (state[0] !== millis) {
      const [t0, x0, v0] = state
      const delta = (millis - t0) / 1000
      const sgn = sign(delta)
      const dt = Math.min(Math.abs(delta), stepSize) * sgn
      const t1 = t0 + (dt * 1000)
      const a0 = gravityEarth(x0)
      const x1 = x0.add(v0.scale(dt)).add(a0.scale(0.5 * dt * dt))
      const a1 = gravityEarth(x1)
      const v1 = v0.add(a0.add(a1).scale(0.5 * dt))
      state = [t1, x1, v1]
    }
    const [epoch, position, velocity] = state
    const [ri, rj, rk] = position.state
    const [vi, vj, vk] = velocity.state
    return new J2000(epoch, ri, rj, rk, vi, vj, vk)
  }
}

/**
 * Create a closure for interpolating new states, using the linear method, from
 * constructor data.
 *
 * @param states a list of J2000 states
 */
function closureLinear (states: J2000[]): InterpClosure {
  type Range = [number, number]
  type Internal = [Range, Range, Range, Range, Range, Range, Range]
  const cache: Internal[] = []
  for (let i = 0; i < states.length - 1; i++) {
    const [stateA, stateB] = [states[i], states[i + 1]]
    const t: Range = [stateA.epoch.toMillis(), stateB.epoch.toMillis()]
    const ri: Range = [stateA.position.state[0], stateB.position.state[0]]
    const rj: Range = [stateA.position.state[1], stateB.position.state[1]]
    const rk: Range = [stateA.position.state[2], stateB.position.state[2]]
    const vi: Range = [stateA.velocity.state[0], stateB.velocity.state[0]]
    const vj: Range = [stateA.velocity.state[1], stateB.velocity.state[1]]
    const vk: Range = [stateA.velocity.state[2], stateB.velocity.state[2]]
    cache.push([t, ri, rj, rk, vi, vj, vk])
  }
  return (millis: number): J2000 => {
    let dex = 0
    for (let i = 0; i < cache.length; i++) {
      const [start, end] = cache[i][0]
      if (millis >= start && millis <= end) {
        dex = i
        break
      }
    }
    const [t, ri, rj, rk, vi, vj, vk] = cache[dex]
    const riVal = linearInterpolate(millis, t[0], ri[0], t[1], ri[1])
    const rjVal = linearInterpolate(millis, t[0], rj[0], t[1], rj[1])
    const rkVal = linearInterpolate(millis, t[0], rk[0], t[1], rk[1])
    const viVal = linearInterpolate(millis, t[0], vi[0], t[1], vi[1])
    const vjVal = linearInterpolate(millis, t[0], vj[0], t[1], vj[1])
    const vkVal = linearInterpolate(millis, t[0], vk[0], t[1], vk[1])
    return new J2000(millis, riVal, rjVal, rkVal, viVal, vjVal, vkVal)
  }
}

/** Interpolate ephemeris from an array of J2000 states. */
export class Interpolator implements IPropagator {
  /** Propagator identifier string. */
  public type: PropagatorType
  /** Revert state on reset call. */
  public resetState: J2000
  /** Interpolator model options. */
  public model: IInterpolatorModel
  /** Time range available for interpolation, in UNIX milliseconds. */
  public range: [number, number]
  /** Closure used for interpolation. */
  public closure: InterpClosure
  /** Cache for last computed statellite state. */
  public state: J2000

  /**
   * Create a new Interpolator object. If values are not specified in the
   * model argument, the following options are used:
   *
   *   method = InterpolationMethods.VERLET
   *   stepSize = 60
   *
   * @param states a list of propagated J2000 states
   * @param model Interpolator model options
   */
  public constructor (states: J2000[], model?: InterpolatorOptions) {
    this.type = PropagatorType.INTERPOLATOR
    model = model || {}
    this.model = { ...DEFAULT_MODEL, ...model }
    this.range = [
      states[0].epoch.toMillis(), states[states.length - 1].epoch.toMillis()
    ]
    this.resetState = states[0]
    this.state = states[0]
    if (this.model.method === InterpolatorMethods.LINEAR) {
      this.closure = closureLinear(states)
    } else if (this.model.method === InterpolatorMethods.VERLET) {
      this.closure = closureVerlet(states, this.model.stepSize)
    } else {
      this.closure = closureLinear(states)
    }
  }

  /**
   * Restore cached state to initial propagator state.
   */
  public reset (): Interpolator {
    this.state = this.resetState
    return this
  }

  /**
   * Propagate satellite state to a new epoch.
   *
   * NOTE: The interpolator will throw a RangeError if the propagation time is
   * outside the range of states provided for interpolation.
   *
   * @param millis milliseconds since 1 January 1970, 00:00 UTC
   */
  public propagate (millis: number): J2000 {
    if (millis < this.range[0] || millis > this.range[1]) {
      const tryDate = new Date(millis).toUTCString()
      const startDate = new Date(this.range[0]).toUTCString()
      const endDate = new Date(this.range[1]).toUTCString()
      throw new RangeError(
        `Epoch [${tryDate}] outside valid range: [${startDate}] -> [${endDate}]`
      )
    }
    this.state = this.closure(millis)
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
