// import pious-squid modules
const PiousSquid = require('..')
const J2000 = PiousSquid.J2000
const RungeKutta4 = PiousSquid.RungeKutta4
const Satellite = PiousSquid.Satellite

// create the satellite's initial state
let initState = new J2000(
    Date.UTC(2010, 2, 10, 22, 53, 14, 697),  // 10 March, 2010 22:53:14.697 UTC
    8228, 389, 6888,                         // position (kilometers)
    -0.7, 6.6, -0.6                          // velocity (kilometers per second)
)

// initialize the RK4 propagator, changing the stepsize to 300 seconds
let rk4Prop = new RungeKutta4(initState, { stepSize: 300 })

// create the satellite object; the name is optional
let satellite = new Satellite(rk4Prop, { name: "Example Satellite" })

// propagate the satellite state one day forward
satellite.propagate(Date.UTC(2010, 2, 11, 22, 53, 14, 697))

// display the satellite's geodetic coordinates at the new state
console.log(satellite.toGeodetic())
// =>
// Geodetic {
//     latitude: -0.41506232623548256,
//     longitude: 1.4829388482855728,
//     altitude: 9781.485856227775 }