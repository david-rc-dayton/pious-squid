// import pious-squid modules
const PiousSquid = require('..')
const J2000 = PiousSquid.J2000
const RungeKutta4 = PiousSquid.RungeKutta4
const Satellite = PiousSquid.Satellite


// create the satellite's initial state
let initState = new J2000(
    Date.UTC(2010, 2, 10, 22, 53, 14, 697),
    8228, 389, 6888,
    -0.7, 6.6, -0.6
)
//=> [J2000]
//   Epoch: Wed, 10 Mar 2010 22:53:14 GMT
//   Position: [ 8228, 389, 6888 ] km
//   Velocity: [ -0.7, 6.6, -0.6 ] km/s


// initialize the RK4 propagator, changing the stepsize to 300 seconds
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


// create the satellite object; the name is optional
let satellite = new Satellite(rk4Prop, { name: "Example Satellite" })
//=> [Satellite]
//   Name: Example Satellite
//   Propagator: rk4



// propagate the satellite state one day forward
let newState = satellite.propagate(Date.UTC(2010, 2, 11, 22, 53, 14, 697))
//=> [J2000]
//   Epoch: Thu, 11 Mar 2010 22:53:14 GMT
//   Position: [ -7924.483, -12493.015, -6492.194 ] km
//   Velocity: [ 2.75, -2.552, 2.332 ] km/s



// get the satellite's geodetic coordinates at the new state
let geoLocation = newState.toECI().toECEF().toGeodetic()
//=> [Geodetic]
//   Latitude: -23.781°
//   Longitude: 84.966°
//   Altitude: 9781.486 km
