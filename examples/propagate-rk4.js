// Example: using the RungeKutta4 propagator

// import pious-squid module
const PiousSquid = require('..')
const J2000 = PiousSquid.J2000
const RungeKutta4 = PiousSquid.RungeKutta4


// create the initial state
let initState = new J2000(
  Date.UTC(2010, 2, 10, 22, 53, 14, 697),  // UTC epoch
  8228, 389, 6888,                         // position (km)
  -0.7, 6.6, -0.6                          // velocity (km/s)
)
//=> [J2000]
//   Epoch: Wed, 10 Mar 2010 22:53:14 GMT
//   Position: [ 8228, 389, 6888 ] km
//   Velocity: [ -0.7, 6.6, -0.6 ] km/s


// initialize the propagator, changing the stepsize to 300 seconds
let rk4Prop = new RungeKutta4(initState, { stepSize: 300 })
//=> [RungeKutta4]
//   Step Size: 300 seconds
//   Satellite Mass: 1000 kg
//   Satellite Surface Area: 1 m^2
//   Drag Coefficient: 2.2
//   Reflectivity Coefficient: 1.4
//   J2 Effect: ENABLED
//   J3 Effect: ENABLED
//   J4 Effect: ENABLED
//   Sun Gravity: ENABLED
//   Moon Gravity: ENABLED
//   Solar Radiation Pressure: ENABLED
//   Atmospheric Drag: ENABLED


// propagate the state one day forward
let newState = rk4Prop.propagate(Date.UTC(2010, 2, 11, 22, 53, 14, 697))
//=> [J2000]
//   Epoch: Thu, 11 Mar 2010 22:53:14 GMT
//   Position: [ -7924.483, -12493.015, -6492.194 ] km
//   Velocity: [ 2.75, -2.552, 2.332 ] km/s
