import { J2000 } from "../coordinates/j2000";
import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";
import { IPropagator } from "./propagator-interface";
import { RungeKutta4Propagator } from "./runge-kutta-4-propagator";

export class InterpolatorPropagator implements IPropagator {
  public readonly propagator: RungeKutta4Propagator;
  private readonly initStates: J2000[];

  constructor(states: J2000[]) {
    this.initStates = states;
    this.sortStates();
    this.propagator = new RungeKutta4Propagator(this.initStates[0]);
    this.setStepSize(60);
  }

  private sortStates() {
    this.initStates.sort((a, b) => a.epoch.unix - b.epoch.unix);
  }

  public setStepSize(seconds: number) {
    this.propagator.setStepSize(seconds);
  }

  get state() {
    return this.propagator.state;
  }

  public reset() {
    this.propagator.setInitState(this.initStates[0]);
  }

  get forceModel() {
    return this.propagator.forceModel;
  }

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

  public propagate(epoch: EpochUTC) {
    this.propagator.setInitState(this.getNearest(epoch));
    this.propagator.propagate(epoch);
    return this.state;
  }

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
