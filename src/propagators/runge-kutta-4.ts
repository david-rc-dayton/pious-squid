import { J2000 } from '../coordinates/j2000'
import { Epoch } from '../epoch'
import { derivative } from '../forces'
import { sign } from '../operations'
import { Vector } from '../vector'
import {
  NumericalModel, NumericalOptions, Propagator, PropagatorType
} from './propagator-interface'

/** 4th order Runge-Kutta numerical integrator for satellite propagation. */
export class RungeKutta4 implements Propagator {
  /** Default propagator model. */
  public static readonly DEFAULT_MODEL: NumericalModel = {
    area: 1,
    atmosphericDrag: true,
    drag: 2.2,
    gravityMoon: true,
    gravitySun: true,
    j2Effect: true,
    j3Effect: true,
    j4Effect: true,
    mass: 1000,
    reflect: 1.4,
    solarRadiation: true,
    stepSize: 60
  }
  /** Default propagator model for two-body acceleration. */
  public static readonly DEFAULT_MODEL_TWOBODY: NumericalModel = {
    area: 0,
    atmosphericDrag: false,
    drag: 0,
    gravityMoon: false,
    gravitySun: false,
    j2Effect: false,
    j3Effect: false,
    j4Effect: false,
    mass: 0,
    reflect: 0,
    solarRadiation: false,
    stepSize: 60
  }
  /** Propagator identifier string. */
  public readonly type: string
  /** Propagator force model. */
  public readonly model: NumericalModel
  /** Cached state used in propagator calculations after initialization. */
  public state: J2000
  /** Propagator initial state. */
  private readonly initState: J2000

  /**
   * Create a new RungeKutta4 propagator object. If values are not specified in
   * the model argument, options are merged from: DEFAULT_MODEL
   *
   * @param state satellite state
   * @param model propagator options
   */
  public constructor (state: J2000, model?: NumericalOptions) {
    this.type = PropagatorType.RUNGE_KUTTA_4
    this.initState = state
    this.state = state
    model = model || {}
    this.model = { ...RungeKutta4.DEFAULT_MODEL, ...model }
  }

  /**
   * Create a new RungeKutta4 propagator object. If values are not specified in
   * the model argument, options are merged from: DEFAULT_MODEL_TWOBODY
   *
   * @param state satellite state
   * @param model propagator options
   */
  public static twoBody (state: J2000, model?: NumericalOptions): RungeKutta4 {
    model = model || {}
    const mergeModel = { ...RungeKutta4.DEFAULT_MODEL_TWOBODY, ...model }
    return new RungeKutta4(state, mergeModel)
  }

  /** Return a string representation of the object. */
  public toString (): string {
    const status = (p: boolean) => p ? 'ENABLED' : 'DISABLED'
    return [
      '[RungeKutta4]',
      `  Step Size:  ${this.model.stepSize} seconds`,
      `  Satellite Mass:  ${this.model.mass} kg`,
      `  Satellite Surface Area:  ${this.model.area} m^2`,
      `  Drag Coefficient:  ${this.model.drag}`,
      `  Reflectivity Coefficient:  ${this.model.reflect}`,
      `  J2 Effect:  ${status(this.model.j2Effect)}`,
      `  J3 Effect:  ${status(this.model.j3Effect)}`,
      `  J4 Effect:  ${status(this.model.j4Effect)}`,
      `  Sun Gravity:  ${status(this.model.gravitySun)}`,
      `  Moon Gravity:  ${status(this.model.gravityMoon)}`,
      `  Solar Radiation Pressure:  ${status(this.model.solarRadiation)}`,
      `  Atmospheric Drag:  ${status(this.model.atmosphericDrag)}`
    ].join('\n')
  }

  /** Restore initial propagator state. */
  public reset (): RungeKutta4 {
    this.state = this.initState
    return this
  }

  /**
   * Propagate satellite state to a new epoch.
   *
   * @param millis milliseconds since 1 January 1970, 00:00 UTC
   */
  public propagate (millis: number): J2000 {
    const unix = millis / 1000
    while (this.state.epoch.unix !== unix) {
      const delta = unix - this.state.epoch.unix
      const sgn = sign(delta)
      const stepNorm = Math.min(Math.abs(delta), this.model.stepSize) * sgn
      this.state = this.integrate(stepNorm)
    }
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

  /**
   * Generate a derivative function given the propagator's current model
   * options.
   */
  private genDerivative (): (epoch: Epoch, posVel: Vector) => Vector {
    return (epoch: Epoch, posVel: Vector) => {
      return derivative(epoch, posVel, this.model)
    }
  }

  /**
   * Integrate orbital perturbations to a new state.
   *
   * @param step step size, in seconds
   */
  private integrate (step: number): J2000 {
    const { epoch, position, velocity } = this.state
    const posVel = position.concat(velocity)
    const drv = this.genDerivative()
    const k1 = drv(epoch, posVel)
    const k2 = drv(epoch.roll(step / 2),
      posVel.add(k1.scale(step / 2)))
    const k3 = drv(epoch.roll(step / 2),
      posVel.add(k2.scale(step / 2)))
    const k4 = drv(epoch.roll(step), posVel.add(k3.scale(step)))
    const [ri, rj, rk, vi, vj, vk] = posVel.add(k1.add(k2.scale(2))
      .add(k3.scale(2)).add(k4).scale(step / 6)).state
    return new J2000(epoch.roll(step).toMillis(), ri, rj, rk, vi, vj, vk)
  }
}
