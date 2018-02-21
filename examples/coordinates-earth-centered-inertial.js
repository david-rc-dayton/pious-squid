// Example: using EarthCenteredFixed coordinates

// import pious-squid module
const PiousSquid = require('..')
const EarthCenteredInertial = PiousSquid.EarthCenteredInertial


// create a new Earth Centered Inertial (ECI) coordinate
let coordECI = new EarthCenteredInertial(
  Date.UTC(2010, 2, 10, 22, 53, 14, 697),  // UTC epoch
  8228, 389, 6888,                         // position (km)
  -0.7, 6.6, -0.6                          // velocity (km/s)
)

console.log(coordECI.toString())
//=> [EarthCenteredInertial]
//   Epoch:  Wed, 10 Mar 2010 22:53:14 GMT
//   Position:  [ 8228, 389, 6888 ] km
//   Velocity:  [ -0.7, 6.6, -0.6 ] km/s


// convert to Earth Centered Earth Fixed (ECEF) coordinate frame
let coordECEF = coordECI.toECEF()

console.log(coordECEF.toString())
//=> [EarthCenteredFixed]
//   Position:  [ -7068.812, -4228.854, 6888 ] km
//   Velocity:  [ 3.426, -4.971, -0.6 ] km/s


// convert to J2000 (J2K) coordinate frame
let coordJ2K = coordECI.toJ2K()

console.log(coordJ2K.toString())
//=> [J2000]
//   Epoch:  Wed, 10 Mar 2010 22:53:14 GMT
//   Position:  [ 8235.935, 369.732, 6879.572 ] km
//   Velocity:  [ -0.685, 6.602, -0.599 ] km/s
