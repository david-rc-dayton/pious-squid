import { J2000 } from "../coordinates/j2000";
import { Epoch } from "../epoch";
import { derivative } from "../forces";
import { sign } from "../operations";

function rungeKutta4(step: number, state: J2000): J2000 {
    const epoch = state.epoch;
    const positionVelocity = state.position.concat(state.velocity);
    const k1 = derivative(state);
    const k2T = epoch.roll(step / 2);
    const k2RV = positionVelocity.add(k1.scale(step / 2));
    const k2 = derivative(new J2000(k2T, k2RV.slice(0, 3), k2RV.slice(3, 6)));
    const k3T = epoch.roll(step / 2);
    const k3RV = positionVelocity.add(k2.scale(step / 2));
    const k3 = derivative(new J2000(k3T, k3RV.slice(0, 3), k3RV.slice(3, 6)));
    const k4T = epoch.roll(step);
    const k4RV = positionVelocity.add(k3.scale(step));
    const k4 = derivative(new J2000(k4T, k4RV.slice(0, 3), k4RV.slice(3, 6)));
    const output = positionVelocity
        .add(k1.add(k2.scale(2)).add(k3.scale(2)).add(k4).scale(step / 6));
    return new J2000(epoch.roll(step), output.slice(0, 3), output.slice(3, 6));
}

export function propagate(state: J2000, epoch: Epoch, step = 60): J2000 {
    while (state.epoch.epoch !== epoch.epoch) {
        const delta = epoch.epoch - state.epoch.epoch;
        const s = sign(delta);
        const stepNorm = Math.min(Math.abs(delta), step) * s;
        state = rungeKutta4(stepNorm, state);
    }
    return state;
}
