import { J2000 } from "../coordinates/j2000";

/** Common interface for propagator objects. */
export interface IPropagator {
    /** Propagator identifier string. */
    type: string;
    /** Cache for last computed statellite state. */
    state: J2000;
    /** Propagate state to a new epoch. */
    propagate(millis: number): J2000;
    /** Propagate state by some number of seconds, repeatedly. */
    step(millis: number, interval: number, count: number): J2000[];
    /** Restore initial propagator state. */
    reset(): IPropagator;
}

/** Propagator type identifiers. */
export enum PropagatorType {
    RUNGE_KUTTA_4 = "runge-kutta-4",
    KEPLER = "kepler",
    INTERPOLATOR = "interpolator",
}

/** Options for numerical integration propagation models. */
export interface INumericalModel {
    /** Step size, in seconds. */
    stepSize: number;
    /** Model J2 effect, if true. */
    j2Effect: boolean;
    /** Model J3 effect, if true. */
    j3Effect: boolean;
    /** Model J4 effect, if true. */
    j4Effect: boolean;
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
    drag: number;
    /** Satellite reflectivity coefficient. */
    reflect: number;
}

/** Options for numerical integration propagation constructors. */
export type NumericalOptions = Partial<INumericalModel>;
