// Example: using the EarthCenteredFixed coordinates

// import pious-squid module
const PiousSquid = require('..')
const EarthCenteredFixed = PiousSquid.EarthCenteredFixed
const Geodetic = PiousSquid.Geodetic
const DEG2RAD = PiousSquid.constants.DEG2RAD


// create a new Earth Centered Earth Fixed (ECEF) coordinate, in kilometers
let coordECEF = new EarthCenteredFixed(1389.432, 4631.217, 4145.652)

console.log(coordECEF.toString())
//=> [EarthCenteredFixed]
//   Position:  [ 1389.432, 4631.217, 4145.652 ] km
//   Velocity:  [ 0, 0, 0 ] km/s


// convert to Earth Centered Inertial (ECI) coordinate frame for a given epoch
let coordECI = coordECEF.toECI(Date.UTC(2016, 11, 12))

console.log(coordECI.toString())
//=> [EarthCenteredInertial]
//   Epoch:  Mon, 12 Dec 2016 00:00:00 GMT
//   Position:  [ -4361.339, 2087.443, 4145.652 ] km
//   Velocity:  [ -0.152, -0.318, 0 ] km/s


// convert to Geodetic (LLA) coordinate frame
let coordGeo = coordECEF.toGeodetic()

console.log(coordGeo.toString())
//=> [Geodetic]
//   Latitude:  40.800°
//   Longitude:  73.300°
//   Altitude:  0.026 km


// convert to Spherical coordinates
let coordSph = coordECEF.toSpherical()

console.log(coordSph.toString())
//=> [Spherical]
//   (r) Radius:  6369.075 km
//   (θ) Inclination:  49.390°
//   (φ) Azimuth:  73.300°


// convert to Topocentric-Horizon coordinates, relative to an observer
let coordTopo = coordECEF.toTopocentric(new Geodetic(
  30 * DEG2RAD,  // observer latitude (radians)
  70 * DEG2RAD,  // observer longitude (radians)
  0.125          // observer altitude (km)
))

console.log(coordTopo.toString())
//=> [Topocentric]
//   (S)outh:  -1195.177 km
//   (E)ast:  278.331 km
//   (Z)enith:  -119.675 km
