import { J2000 } from "../coordinates/j2000";
import { Epoch } from "../epoch";
import { derivative } from "../forces";
import { sign } from "../operations";
import { Vector } from "../vector";
import {
    INumericalModel, IPropagator, PropagatorType,
} from "./propagator-interface";

/** Default propagator model. */
const DEFAULT_MODEL: INumericalModel = {
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
    stepSize: 60,
};

/** Default propagator model for two-body acceleration. */
const DEFAULT_MODEL_TWOBODY: INumericalModel = {
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
    stepSize: 0,
};

/** 4th order Runge-Kutta numerical integrator for satellite propagation. */
export class RungeKutta4 implements IPropagator {
    /**
     * Create a new RungeKutta4 propagator object, using onlt two-body
     * perturbation options.
     */
    public static twoBody(state: J2000, model?: INumericalModel): RungeKutta4 {
        model = model || {};
        const mergeModel = { ...DEFAULT_MODEL_TWOBODY, ...model };
        return new RungeKutta4(state, mergeModel);
    }

    /** Propagator identifier string. */
    public readonly type: string;
    /** Cached state used in propagator calculations after initialization. */
    public readonly state: J2000;
    /** Step size, in seconds. */
    public readonly stepSize: number;
    /** Model J2 effect, if true. */
    public readonly j2Effect: boolean;
    /** Model J3 effect, if true. */
    public readonly j3Effect: boolean;
    /** Model J4 effect, if true. */
    public readonly j4Effect: boolean;
    /** Model Solar gravity, if true. */
    public readonly gravitySun: boolean;
    /** Model Lunar gravity, if true. */
    public readonly gravityMoon: boolean;
    /** Model Solar radiation pressure, if true. */
    public readonly solarRadiation: boolean;
    /** Model atmospheric drag, if true. */
    public readonly atmosphericDrag: boolean;
    /** Satellite mass, in kilograms */
    public readonly mass: number;
    /** Satellite surface area, in meters squared */
    public readonly area: number;
    /** Satellite drag coefficient. */
    public readonly drag: number;
    /** Satellite reflectivity coefficient. */
    public readonly reflect: number;

    /**
     * Create a new RungeKutta4 propagator object. If values are not specified
     * in the model argument, the following options will be used:
     *
     *     stepSize        = 60      // seconds
     *     j2Effect        = true    // enabled
     *     j3Effect        = true    // enabled
     *     j4Effect        = true    // enabled
     *     gravitySun      = true    // enabled
     *     gravityMoon     = true    // enabled
     *     solarRadiation  = true    // enabled
     *     atmosphericDrag = true    // enabled
     *     mass            = 1000    // kilograms
     *     area            = 1       // meters squared
     *     drag            = 2.2     // coefficient
     *     reflect         = 1.4     // coefficient
     *
     * @param state satellite state
     * @param model propagator options
     */
    public constructor(state: J2000, model?: INumericalModel) {
        this.type = PropagatorType.RUNGE_KUTTA_4;
        this.state = state;
        model = model || {};
        const mergeModel = { ...DEFAULT_MODEL, ...model };
        this.stepSize = mergeModel.stepSize as number;
        this.j2Effect = mergeModel.j2Effect as boolean;
        this.j3Effect = mergeModel.j3Effect as boolean;
        this.j4Effect = mergeModel.j4Effect as boolean;
        this.gravitySun = mergeModel.gravitySun as boolean;
        this.gravityMoon = mergeModel.gravityMoon as boolean;
        this.solarRadiation = mergeModel.solarRadiation as boolean;
        this.atmosphericDrag = mergeModel.atmosphericDrag as boolean;
        this.mass = mergeModel.mass as number;
        this.area = mergeModel.area as number;
        this.drag = mergeModel.drag as number;
        this.reflect = mergeModel.reflect as number;
    }

    /** Return a string representation of the object. */
    public toString(): string {
        const status = (p: boolean) => p ? "ENABLED" : "DISABLED";
        return [
            "[RungeKutta4]",
            `  Step Size: ${this.stepSize} seconds`,
            `  Satellite Mass: ${this.mass} kg`,
            `  Satellite Surface Area: ${this.area} m^2`,
            `  Drag Coefficient: ${this.drag}`,
            `  Reflectivity Coefficient: ${this.reflect}`,
            `  J2 Effect: ${status(this.j2Effect)}`,
            `  J3 Effect: ${status(this.j3Effect)}`,
            `  J4 Effect: ${status(this.j4Effect)}`,
            `  Sun Gravity: ${status(this.gravitySun)}`,
            `  Moon Gravity: ${status(this.gravityMoon)}`,
            `  Solar Radiation Pressure: ${status(this.solarRadiation)}`,
            `  Atmospheric Drag: ${status(this.atmosphericDrag)}`,
        ].join("\n");
    }

    /**
     * Propagate satellite state to a new epoch.
     *
     * @param millis milliseconds since 1 January 1970, 00:00 UTC
     */
    public propagate(millis: number): J2000 {
        const unix = millis / 1000;
        let tempState = this.state;
        while (tempState.epoch.unix !== unix) {
            const delta = unix - tempState.epoch.unix;
            const sgn = sign(delta);
            const stepNorm = Math.min(Math.abs(delta), this.stepSize) * sgn;
            tempState = this.integrate(tempState, stepNorm);
        }
        return tempState;
    }

    /**
     * Propagate state by some number of seconds, repeatedly, starting at a
     * specified epoch.
     *
     * @param millis propagation start time
     * @param interval seconds between output states
     * @param count number of steps to take
     */
    public step(millis: number, interval: number, count: number): J2000[] {
        let tempState = this.propagate(millis);
        const output: J2000[] = [tempState];
        let epochStart = tempState.epoch.unix;
        for (let i = 0; i < count; i++) {
            const unix = epochStart + interval;
            while (tempState.epoch.unix !== unix) {
                const delta = unix - tempState.epoch.unix;
                const sgn = sign(delta);
                const stepNorm = Math.min(Math.abs(delta), this.stepSize) * sgn;
                tempState = this.integrate(tempState, stepNorm);
            }
            epochStart = tempState.epoch.unix;
            output.push(tempState);
        }
        return output;
    }

    /**
     * Generate a derivative function given the propagator's current model
     * options.
     */
    private genDerivative(): (epoch: Epoch, posVel: Vector) => Vector {
        const { j2Effect, j3Effect, j4Effect, gravitySun, gravityMoon,
            solarRadiation, atmosphericDrag, mass, area, drag, reflect } = this;
        return (epoch: Epoch, posVel: Vector) => {
            return derivative(
                epoch,
                posVel,
                j2Effect,
                j3Effect,
                j4Effect,
                gravitySun,
                gravityMoon,
                solarRadiation,
                atmosphericDrag,
                mass,
                area,
                drag,
                reflect,
            );
        };
    }

    /**
     * Integrate orbital perturbations to a new state.
     *
     * @param step step size, in seconds
     */
    private integrate(state: J2000, step: number): J2000 {
        const { epoch, position, velocity } = state;
        const posVel = position.concat(velocity);
        const drv = this.genDerivative();
        const k1 = drv(epoch, posVel);
        const k2 = drv(epoch.roll(step / 2),
            posVel.add(k1.scale(step / 2)));
        const k3 = drv(epoch.roll(step / 2),
            posVel.add(k2.scale(step / 2)));
        const k4 = drv(epoch.roll(step), posVel.add(k3.scale(step)));
        const [ri, rj, rk, vi, vj, vk] = posVel.add(k1.add(k2.scale(2))
            .add(k3.scale(2)).add(k4).scale(step / 6)).state;
        return new J2000(epoch.roll(step).toMillis(), ri, rj, rk, vi, vj, vk);
    }
}
