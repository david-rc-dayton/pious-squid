// Example: using Geodetic coordinates

// import pious-squid module
const PiousSquid = require('..')
const Geodetic = PiousSquid.Geodetic
const DEG2RAD = PiousSquid.constants.DEG2RAD


// create a new Geodetic (LLA) coordinate
let coordGeo = new Geodetic(
  30 * DEG2RAD,  // observer latitude (radians)
  70 * DEG2RAD,  // observer longitude (radians)
  0.125          // observer altitude (km)
)

console.log(coordGeo.toString())
//=> [Geodetic]
//   Latitude:  30.000°
//   Longitude:  70.000°
//   Altitude:  0.125 km


// convert to Earth Centered Earth Fixed (ECEF) coordinate frame
let coordECEF = coordGeo.toECEF()

console.log(coordECEF.toString())
//=> [EarthCenteredFixed]
//   Position:  [ 1890.812, 5194.963, 3170.436 ] km
//   Velocity:  [ 0, 0, 0 ] km/s
