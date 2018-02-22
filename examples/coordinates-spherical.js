// Example: using Spherical coordinates

// import pious-squid module
const PiousSquid = require('..')
const Spherical = PiousSquid.Spherical
const DEG2RAD = PiousSquid.constants.DEG2RAD


// create a new Spherical coordinate
let coordSph = new Spherical(
  6369.075,         // range (km)
  49.39 * DEG2RAD,  // inclination (radians)
  73.3 * DEG2RAD    // azimuth (radians)
)

console.log(coordSph.toString())
//=> [Spherical]
//   (r) Radius:  6369.075 km
//   (θ) Inclination:  49.390°
//   (φ) Azimuth:  73.300°


// convert to Earth Centered Earth Fixed (ECEF) coordinate frame
let coordECEF = coordSph.toECEF()

console.log(coordECEF.toString())
//=> [EarthCenteredFixed]
//   Position:  [ 1389.426, 4631.199, 4145.674 ] km
//   Velocity:  [ 0, 0, 0 ] km/s
