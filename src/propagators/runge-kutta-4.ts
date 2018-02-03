import { J2000 } from "../coordinates/j2000";
import { derivative } from "../forces";
import { sign } from "../operations";

/** 4th order Runge-Kutta numerical integrator for satellite propagation. */
export class RungeKutta4 {
    /** State used to initialize the propagator. */
    public initialState: J2000;
    /** Cached state used in propagator calculations after initialization. */
    public cachedState: J2000;
    /** Step size, in seconds. */
    public stepSize: number;

    /**
     * Create a new RungeKutta4 propagator object.
     * @param state satellite state, in J2000 coordinate frame
     * @param stepSize integration step size, in seconds
     */
    public constructor(state: J2000, stepSize = 60) {
        this.initialState = state;
        this.cachedState = state;
        this.stepSize = stepSize;
    }

    /** Reset the propagator cached state to its initial state. */
    public reset(): RungeKutta4 {
        this.cachedState = this.initialState;
        return this;
    }

    /**
     * Propagate satellite state to a new epoch.
     *
     * @param millis milliseconds since 1 January 1970, 00:00 UTC
     */
    public propagate(millis: number): J2000 {
        const unix = millis / 1000;
        while (this.cachedState.epoch.unix !== unix) {
            const delta = unix - this.cachedState.epoch.unix;
            const s = sign(delta);
            const stepNorm = Math.min(Math.abs(delta), this.stepSize) * s;
            this.cachedState = this.integrate(stepNorm);
        }
        return this.cachedState;
    }

    /**
     * Integrate orbital perturbations to a new state.
     *
     * @param step step size, in seconds
     */
    private integrate(step: number): J2000 {
        const { epoch, position, velocity } = this.cachedState;
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
