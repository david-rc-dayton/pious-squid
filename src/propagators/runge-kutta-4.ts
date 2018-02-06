import { J2000 } from "../coordinates/j2000";
import { derivative } from "../forces";
import { sign } from "../operations";
import { IPropagator } from "./propagator-interface";

/** 4th order Runge-Kutta numerical integrator for satellite propagation. */
export class RungeKutta4 implements IPropagator {
    /** Cached state used in propagator calculations after initialization. */
    public state: J2000;
    /** Step size, in seconds. */
    public stepSize: number;
    /** State used to initialize the propagator. */
    private initState: J2000;

    /**
     * Create a new RungeKutta4 propagator object.
     * @param state satellite state, in J2000 coordinate frame
     * @param stepSize integration step size, in seconds
     */
    public constructor(state: J2000, stepSize = 60) {
        this.initState = state;
        this.state = state;
        this.stepSize = stepSize;
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
     * Integrate orbital perturbations to a new state.
     *
     * @param step step size, in seconds
     */
    private integrate(step: number): J2000 {
        const { epoch, position, velocity } = this.state;
        const posVel = position.concat(velocity);
        const k1 = derivative(epoch, posVel);
        const k2 = derivative(epoch.roll(step / 2),
            posVel.add(k1.scale(step / 2)));
        const k3 = derivative(epoch.roll(step / 2),
            posVel.add(k2.scale(step / 2)));
        const k4 = derivative(epoch.roll(step), posVel.add(k3.scale(step)));
        const [ri, rj, rk, vi, vj, vk] = posVel.add(k1.add(k2.scale(2))
            .add(k3.scale(2)).add(k4).scale(step / 6)).state;
        return new J2000(epoch.roll(step).toMillis(), ri, rj, rk, vi, vj, vk);
    }
}
