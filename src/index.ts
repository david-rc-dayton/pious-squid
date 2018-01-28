import { J2000 } from './coordinates/j2000'
import { Epoch } from './epoch'
import { Vector } from './vector'
import { propagate } from './propagators/runge-kutta-4'

if (require.main === module) {
    let geoEpoch = Epoch.fromUnixTimestamp(1498547193.584)
    let geoPosition = new Vector([
        4.12853342060e4, 7.43471681700e3, -3.67624010600e3
    ])
    let geoVelocity = new Vector([
        -5.32810000000e-1, 3.03035500000e0, 1.05016000000e-1
    ])
    let geoState = new J2000(geoEpoch, geoPosition, geoVelocity)
    let finalState = propagate(geoState, geoEpoch.roll(86400), 300)
    console.log(finalState.epoch)
    console.log(finalState.position.distance(new Vector([
        4.11526359989e4, 8.14874780238e3, -3.65210292647e3
    ])))
    console.log(finalState.velocity.distance(new Vector([
        -5.84795155962e-1, 3.02059500637e0, 1.09651877768e-1
    ])))
}
