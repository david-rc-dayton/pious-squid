import { J2000 } from "../coordinates/j2000";
import { EpochUTC } from "../time/epoch-utc";

/** Common interface for propagator objects. */
export interface IPropagator {
  /** Cache for last computed statellite state. */
  state: J2000;
  /** Propagate state to a new epoch. */
  propagate(epoch: EpochUTC): J2000;
  /** Propagate state by some number of seconds, repeatedly. */
  step(epoch: EpochUTC, interval: number, count: number): J2000[];
  /** Restore initial propagator state. */
  reset(): void;
}

/** Options for numerical integration propagation models. */
export interface INumericalModel {
  /** Step size, in seconds. */
  stepSize: number;
  /** Model Solar gravity, if true. */
  gravitySun: boolean;
  /** Model Lunar gravity, if true. */
  gravityMoon: boolean;
  /** Model Solar radiation pressure, if true. */
  solarRadiation: boolean;
  /** Model atmospheric drag, if true. */
  atmosphericDrag: boolean;
  /** Satellite mass, in kilograms */
  mass: number;
  /** Satellite surface area, in meters squared */
  area: number;
  /** Satellite drag coefficient. */
  dragCoeff: number;
  /** Satellite reflectivity coefficient. */
  reflectCoeff: number;
  /** Geopotential coefficient degree. (max=20) */
  degree: number;
  /** Geopotential coefficient order. (max=20) */
  order: number;
}

/** Options for numerical integration propagation constructors. */
export type NumericalOptions = Partial<INumericalModel>;
