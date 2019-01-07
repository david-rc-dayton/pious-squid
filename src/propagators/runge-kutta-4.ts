import { J2000 } from "../coordinates/j2000";
import { ForceModel } from "../forces/force-model";
import { copySign } from "../math/operations";
import { Vector6D } from "../math/vector-6d";
import { EpochUTC } from "../time/epoch-utc";
import {
  INumericalModel,
  IPropagator,
  NumericalOptions
} from "./propagator-interface";

/** 4th order Runge-Kutta numerical integrator for satellite propagation. */
export class RungeKutta4 implements IPropagator {
  private readonly initState: J2000;
  private cacheState: J2000;
  private forceModel: ForceModel;
  private stepSize: number;
  private static readonly DEFAULT_MODEL: INumericalModel = {
    stepSize: 5,
    degree: 0,
    order: 0,
    area: 16,
    mass: 1400,
    dragCoeff: 2.2,
    reflectCoeff: 1.4,
    gravityMoon: false,
    gravitySun: false,
    atmosphericDrag: false,
    solarRadiation: false
  };

  constructor(state: J2000, model?: NumericalOptions) {
    this.initState = state;
    this.cacheState = this.initState;
    this.forceModel = new ForceModel();
    this.stepSize = RungeKutta4.DEFAULT_MODEL.stepSize;
    this.initialize(model || {});
  }

  private initialize(model: NumericalOptions) {
    const modelMerge = {
      ...RungeKutta4.DEFAULT_MODEL,
      ...model
    } as INumericalModel;
    this.stepSize = modelMerge.stepSize;
    this.forceModel.setEarthGravity(modelMerge.degree, modelMerge.order);
    if (modelMerge.gravityMoon || modelMerge.gravitySun) {
      this.forceModel.setThirdBody(
        modelMerge.gravityMoon,
        modelMerge.gravitySun
      );
    }
    if (modelMerge.atmosphericDrag) {
      this.forceModel.setAtmosphericDrag(
        modelMerge.mass,
        modelMerge.area,
        modelMerge.dragCoeff
      );
    }
    if (modelMerge.solarRadiation) {
      this.forceModel.setSolarRadiationPressure(
        modelMerge.mass,
        modelMerge.area,
        modelMerge.reflectCoeff
      );
    }
  }

  get state() {
    return this.cacheState;
  }

  public reset() {
    this.cacheState = this.initState;
  }

  private kFn(j2kState: J2000, hArg: number, kArg: Vector6D) {
    const epoch = j2kState.epoch.roll(hArg);
    const posvel = j2kState.position.join(j2kState.velocity);
    const [position, velocity] = posvel.add(kArg).split();
    const sample = new J2000(epoch, position, velocity);
    return this.forceModel.derivative(sample);
  }

  private integrate(j2kState: J2000, step: number) {
    const k1 = this.kFn(j2kState, 0, Vector6D.origin()).scale(step);
    const k2 = this.kFn(j2kState, step / 2, k1.scale(1 / 2)).scale(step);
    const k3 = this.kFn(j2kState, step / 2, k2.scale(1 / 2)).scale(step);
    const k4 = this.kFn(j2kState, step, k3).scale(step);
    const v1 = k1;
    const v2 = v1.add(k2.scale(2));
    const v3 = v2.add(k3.scale(2));
    const v4 = v3.add(k4);
    const tNext = j2kState.epoch.roll(step);
    const posvel = j2kState.position.join(j2kState.velocity);
    const [position, velocity] = posvel.add(v4.scale(1 / 6)).split();
    return new J2000(tNext, position, velocity);
  }

  public propagate(newEpoch: EpochUTC) {
    while (!this.cacheState.epoch.equals(newEpoch)) {
      const delta = newEpoch.difference(this.cacheState.epoch);
      const mag = Math.min(this.stepSize, Math.abs(delta));
      const step = copySign(mag, delta);
      this.cacheState = this.integrate(this.cacheState, step);
    }
    return this.cacheState;
  }
}
