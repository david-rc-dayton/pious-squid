import { J2000 } from "../coordinates/j2000";
import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";
import { IPropagator } from "./propagator-interface";
import { RungeKutta4Propagator } from "./runge-kutta-4-propagator";

/** Interpolator for cached satellite ephemeris. */
export class InterpolatorPropagator implements IPropagator {
  /** Internal propagator object. */
  private readonly propagator: RungeKutta4Propagator;
  /** Cache of J2000 states. */
  private readonly initStates: J2000[];

  /**
   * Create a new Interpolator Propagator object.
   *
   * @param states list of J2000 state vectors
   */
  constructor(states: J2000[]) {
    this.initStates = states;
    this.sortStates();
    this.propagator = new RungeKutta4Propagator(this.initStates[0]);
    this.setStepSize(60);
  }

  /** Chronologically sort cached states. */
  private sortStates() {
    this.initStates.sort((a, b) => a.epoch.unix - b.epoch.unix);
  }

  /**
   * Set propagator step size.
   *
   * @param seconds step size, in seconds
   */
  public setStepSize(seconds: number) {
    this.propagator.setStepSize(seconds);
  }

  /** Fetch last propagated satellite state. */
  get state() {
    return this.propagator.state;
  }

  /** Reset cached state to the initialized state. */
  public reset() {
    this.propagator.setInitState(this.initStates[0]);
  }

  /** Propagator force model object. */
  get forceModel() {
    return this.propagator.forceModel;
  }

  /**
   * Return the cached state closest to the proved epoch.
   *
   * @param epoch UTC epoch
   */
  private getNearest(epoch: EpochUTC) {
    if (this.initStates.length === 0) {
      return new J2000(epoch, Vector3D.origin(), Vector3D.origin());
    }
    const unix = epoch.unix;
    if (unix < this.initStates[0].epoch.unix) {
      return this.initStates[0];
    }
    if (unix > this.initStates[this.initStates.length - 1].epoch.unix) {
      return this.initStates[this.initStates.length - 1];
    }
    let low = 0;
    let high = this.initStates.length - 1;
    while (low <= high) {
      const mid = Math.floor((high + low) / 2);
      const midVal = this.initStates[mid].epoch.unix;
      if (unix < midVal) {
        high = mid - 1;
      } else if (unix > midVal) {
        low = mid + 1;
      } else {
        return this.initStates[mid];
      }
    }
    const lowDiff = this.initStates[low].epoch.unix - unix;
    const highDiff = unix - this.initStates[high].epoch.unix;
    return lowDiff < highDiff ? this.initStates[low] : this.initStates[high];
  }

  /**
   * Interpolate cached states to a new epoch.
   *
   * @param newEpoch propagation epoch
   */
  public propagate(newEpoch: EpochUTC) {
    this.propagator.setInitState(this.getNearest(newEpoch));
    this.propagator.propagate(newEpoch);
    return this.state;
  }

  /**
   * Interpolate state by some number of seconds, repeatedly, starting at a
   * specified epoch.
   *
   * @param epoch UTC epoch
   * @param interval seconds between output states
   * @param count number of steps to take
   */
  public step(epoch: EpochUTC, interval: number, count: number) {
    const output: J2000[] = [this.propagate(epoch)];
    let tempEpoch = epoch;
    for (let i = 0; i < count; i++) {
      tempEpoch = tempEpoch.roll(interval);
      output.push(this.propagate(tempEpoch));
    }
    return output;
  }
}
