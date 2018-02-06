import { J2000 } from "../coordinates/j2000";
import { Epoch } from "../epoch";
import { derivative } from "../forces";
import { sign } from "../operations";
import { Vector } from "../vector";
import {
    INumericalModel, IPropagator, PropagatorType,
} from "./propagator-interface";

/** 4th order Runge-Kutta numerical integrator for satellite propagation. */
export class RungeKutta4 implements IPropagator {
    /**
     * Create a new RungeKutta4 propagator object, using onlt two-body
     * perturbation options.
     */
    public static twoBody(state: J2000): RungeKutta4 {
        return new RungeKutta4(state, {
            atmosphericDrag: false,
            gravityMoon: false,
            gravitySun: false,
            j2Effect: false,
            j3Effect: false,
            j4Effect: false,
            solarRadiation: false,
        });
    }

    /** Propagator identifier string. */
    public readonly type: string;
    /** Milliseconds since 1 January 1970, 00:00 UTC of initial state. */
    public readonly millis: number;
    /** Cached state used in propagator calculations after initialization. */
    public state: J2000;
    /** Step size, in seconds. */
    public stepSize: number;
    /** Model J2 effect, if true. */
    public j2Effect: boolean;
    /** Model J3 effect, if true. */
    public j3Effect: boolean;
    /** Model J4 effect, if true. */
    public j4Effect: boolean;
    /** Model Solar gravity, if true. */
    public gravitySun: boolean;
    /** Model Lunar gravity, if true. */
    public gravityMoon: boolean;
    /** Model Solar radiation pressure, if true. */
    public solarRadiation: boolean;
    /** Model atmospheric drag, if true. */
    public atmosphericDrag: boolean;
    /** Satellite mass, in kilograms */
    public mass: number;
    /** Satellite surface area, in meters squared */
    public area: number;
    /** Satellite drag coefficient. */
    public drag: number;
    /** Satellite reflectivity coefficient. */
    public reflect: number;
    /** State used to initialize the propagator. */
    private initState: J2000;

    /**
     * Create a new RungeKutta4 propagator object. If values are not specified
     * in the model argument, the following options will be used:
     *
     *     stepSize        = 60
     *     j2Effect        = true
     *     j3Effect        = true
     *     j4Effect        = true
     *     gravitySun      = true
     *     gravityMoon     = true
     *     solarRadiation  = true
     *     atmosphericDrag = true
     *     mass            = 1000
     *     area            = 1
     *     drag            = 2.2
     *     reflect         = 1.4
     *
     * @param state satellite state
     * @param model propagator options
     */
    public constructor(state: J2000, model?: INumericalModel) {
        this.type = PropagatorType.RUNGE_KUTTA_4;
        this.initState = state;
        this.state = state;
        this.millis = state.epoch.toMillis();
        model = model || {};
        this.stepSize = model.stepSize || 60;
        this.j2Effect = model.j2Effect || true;
        this.j3Effect = model.j3Effect || true;
        this.j4Effect = model.j4Effect || true;
        this.gravitySun = model.gravitySun || true;
        this.gravityMoon = model.gravityMoon || true;
        this.solarRadiation = model.solarRadiation || true;
        this.atmosphericDrag = model.atmosphericDrag || true;
        this.mass = model.mass || 1000;
        this.area = model.area || 1;
        this.drag = model.drag || 2.2;
        this.reflect = model.reflect || 1.4;
    }

    /** Reset the propagator cached state to its initial state. */
    public reset(): RungeKutta4 {
        this.state = this.initState;
        return this;
    }

    /**
     * Propagate satellite state to a new epoch.
     *
     * @param millis milliseconds since 1 January 1970, 00:00 UTC
     */
    public propagate(millis: number): J2000 {
        const unix = millis / 1000;
        while (this.state.epoch.unix !== unix) {
            const delta = unix - this.state.epoch.unix;
            const sgn = sign(delta);
            const stepNorm = Math.min(Math.abs(delta), this.stepSize) * sgn;
            this.state = this.integrate(stepNorm);
        }
        return this.state;
    }

    /**
     * Generate a derivative function given the propagator's current model
     * options.
     */
    private genDerivative(): (epoch: Epoch, posVel: Vector) => Vector {
        const { j2Effect, j3Effect, j4Effect, gravitySun, gravityMoon,
            solarRadiation, atmosphericDrag, mass, area, drag, reflect } = this;
        return (epoch: Epoch, posVel: Vector) => {
            return derivative(epoch, posVel,
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
                reflect);
        };
    }

    /**
     * Integrate orbital perturbations to a new state.
     *
     * @param step step size, in seconds
     */
    private integrate(step: number): J2000 {
        const { epoch, position, velocity } = this.state;
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
