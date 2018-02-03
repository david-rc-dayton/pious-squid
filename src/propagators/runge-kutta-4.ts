import { J2000 } from "../coordinates/j2000";
import { Epoch } from "../epoch";
import { derivative } from "../forces";
import { sign } from "../operations";

function rungeKutta4(step: number, state: J2000): J2000 {
    const epoch = state.epoch;
    const posVel = state.position.concat(state.velocity);
    const k1 = derivative(epoch, posVel);
    const k2 = derivative(epoch.roll(step / 2), posVel.add(k1.scale(step / 2)));
    const k3 = derivative(epoch.roll(step / 2), posVel.add(k2.scale(step / 2)));
    const k4 = derivative(epoch.roll(step), posVel.add(k3.scale(step)));
    const [ri, rj, rk, vi, vj, vk] = posVel.add(k1.add(k2.scale(2))
        .add(k3.scale(2)).add(k4).scale(step / 6)).state;
    return new J2000(epoch.roll(step).toMillis(), ri, rj, rk, vi, vj, vk);
}

export function propagate(state: J2000, epoch: Epoch, step = 60): J2000 {
    let outState = state;
    while (outState.epoch.epoch !== epoch.epoch) {
        const delta = epoch.epoch - state.epoch.epoch;
        const s = sign(delta);
        const stepNorm = Math.min(Math.abs(delta), step) * s;
        outState = rungeKutta4(stepNorm, state);
    }
    return outState;
}
