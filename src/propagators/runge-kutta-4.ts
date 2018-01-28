import { J2000 } from '../coordinates/j2000'
import { Epoch } from '../epoch'
import { derivative } from '../forces'
import { sign } from '../operations'

function rungeKutta4(step: number, state: J2000): J2000 {
    let epoch = state.epoch
    let position_velocity = state.position.concat(state.velocity)
    let k1 = derivative(state)
    let k2T = epoch.roll(step / 2)
    let k2RV = position_velocity.add(k1.scale(step / 2))
    let k2 = derivative(new J2000(k2T, k2RV.slice(0, 3), k2RV.slice(3, 6)))
    let k3T = epoch.roll(step / 2)
    let k3RV = position_velocity.add(k2.scale(step / 2))
    let k3 = derivative(new J2000(k3T, k3RV.slice(0, 3), k3RV.slice(3, 6)))
    let k4T = epoch.roll(step)
    let k4RV = position_velocity.add(k3.scale(step))
    let k4 = derivative(new J2000(k4T, k4RV.slice(0, 3), k4RV.slice(3, 6)))
    let output = position_velocity
        .add(k1.add(k2.scale(2)).add(k3.scale(2)).add(k4).scale(step / 6))
    return new J2000(epoch.roll(step), output.slice(0, 3), output.slice(3, 6))
}

export function propagate(state: J2000, epoch: Epoch, step = 60): J2000 {
    while (state.epoch.epoch != epoch.epoch) {
        let delta = epoch.epoch - state.epoch.epoch
        let s = sign(delta)
        let step_norm = Math.min(Math.abs(delta), step) * s
        state = rungeKutta4(step_norm, state)
    }
    return state
}
