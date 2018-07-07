// Example: using the Interpolator meta-propagator

/* 
 * NOTE: The Interpolator class is used to iterpolate between pre-propagated
 * states. This can be used to quickly generate new states over a finite time
 * range rather than numerically integrating perturbations for a solution. In
 * short, this class sacrifices RAM for CPU cycles.
 */

// import pious-squid module
const PiousSquid = require("..");
const J2000 = PiousSquid.J2000;
const RungeKutta4 = PiousSquid.RungeKutta4;
const Interpolator = PiousSquid.Interpolator;

// create the initial state
let initState = new J2000(
  Date.UTC(2010, 2, 10, 22, 53, 14, 697), // UTC epoch
  8228,
  389,
  6888, // position (km)
  -0.7,
  6.6,
  -0.6 // velocity (km/s)
);

console.log(initState.toString());
//=> [J2000]
//   Epoch:  Wed, 10 Mar 2010 22:53:14 GMT
//   Position:  [ 8228, 389, 6888 ] km
//   Velocity:  [ -0.7, 6.6, -0.6 ] km/s

// initialize the propagator
let rk4Prop = new RungeKutta4(initState);

console.log(rk4Prop.toString());
//=> [RungeKutta4]
//   Step Size:  300 seconds
//   Satellite Mass:  1000 kg
//   Satellite Surface Area:  1 m^2
//   Drag Coefficient:  2.2
//   Reflectivity Coefficient:  1.4
//   J2 Effect:  ENABLED
//   J3 Effect:  ENABLED
//   J4 Effect:  ENABLED
//   Sun Gravity:  ENABLED
//   Moon Gravity:  ENABLED
//   Solar Radiation Pressure:  ENABLED
//   Atmospheric Drag:  ENABLED

// cache 24-hours of J2000 states, sampled every 300 seconds
let j2kCache = rk4Prop.step(
  Date.UTC(2010, 2, 10), // start epoch
  300, // interval (seconds)
  288 // iterations (300 secs * 288 = 86400 secs = 24 hrs)
);

console.log(j2kCache.toString());
//=> [J2000]
//   Epoch: Wed, 10 Mar 2010 00:00:00 GMT
//   Position: [ -7100.939, -13074.581, -6033.937 ] km
//   Velocity: [ 2.956, -2.243, 2.461 ] km/s,[J2000]
//   Epoch: Wed, 10 Mar 2010 00:05:00 GMT
//   Position: [ -6184.362, -13689.31, -5270.382 ] km
//   Velocity: [ 3.151, -1.851, 2.626 ] km/s,[J2000]
//   ...
//   ... (full results omitted for brevity)
//   ...
//   Epoch: Wed, 10 Mar 2010 23:55:00 GMT
//   Position: [ -5752.783, 10281.398, -4845.123 ] km
//   Velocity: [ -4.02, -2.303, -3.36 ] km/s,[J2000]
//   Epoch: Thu, 11 Mar 2010 00:00:00 GMT
//   Position: [ -6906.88, 9505.758, -5809.635 ] km
//   Velocity: [ -3.669, -2.853, -3.065 ] km/s

// create a new Interpolator using the cached state
let interp = new Interpolator(j2kCache);

console.log(interp.toString());
//=> [Interpolator]
//   Method: verlet
//   Range: [Wed, 10 Mar 2010 00:00:00 GMT] -> [Thu, 11 Mar 2010 00:00:00 GMT]
//   Step Size: 60 seconds

// interpolate a state in the cached timerange
let newState = interp.propagate(Date.UTC(2010, 2, 10, 11, 23, 9));

console.log(newState.toString());
//=> [J2000]
//   Epoch: Wed, 10 Mar 2010 11:23:09 GMT
//   Position: [ -9175.343, 7168.625, -7667.659 ] km
//   Velocity: [ -2.753, -3.797, -2.314 ] km/s
