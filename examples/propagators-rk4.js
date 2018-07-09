// Example: using the RungeKutta4 propagator

// import pious-squid module
const PiousSquid = require("..");
const J2000 = PiousSquid.J2000;
const RungeKutta4 = PiousSquid.RungeKutta4;

// create the initial state
let initState = new J2000(
  Date.UTC(2010, 2, 10, 22, 53, 14, 697), // UTC epoch
  8228, // i-axis position (km)
  389, // j-axis position (km)
  6888, // k-axis position (km)
  -0.7, // i-axis velocity (km/s)
  6.6, // j-axis velocity (km/s)
  -0.6 // k-axis velocity (km/s)
);

console.log(initState.toString());
//=> [J2000]
//   Epoch:  Wed, 10 Mar 2010 22:53:14 GMT
//   Position:  [ 8228, 389, 6888 ] km
//   Velocity:  [ -0.7, 6.6, -0.6 ] km/s

// initialize the propagator, changing the stepsize to 60 seconds
let rk4Prop = new RungeKutta4(initState, { stepSize: 60 });

console.log(rk4Prop.toString());
//=> [RungeKutta4]
//   Step Size:  60 seconds
//   Satellite Mass:  1000 kg
//   Satellite Surface Area:  1 m^2
//   Drag Coefficient:  2.2
//   Reflectivity Coefficient:  1.4
//   Geopotential Degree:  4
//   Geopotential Order:  4
//   Sun Gravity:  ENABLED
//   Moon Gravity:  ENABLED
//   Solar Radiation Pressure:  ENABLED
//   Atmospheric Drag:  ENABLED

// propagate the state one day forward
let newState = rk4Prop.propagate(Date.UTC(2010, 2, 11, 22, 53, 14, 697));

console.log(newState.toString());
//=> [J2000]
//   Epoch:  Thu, 11 Mar 2010 22:53:14 GMT
//   Position:  [ -7925.762, -12491.855, -6493.288 ] km
//   Velocity:  [ 2.749, -2.552, 2.332 ] km/s
