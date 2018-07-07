// Example: using J2000 coordinates

// import pious-squid module
const PiousSquid = require("..");
const J2000 = PiousSquid.J2000;

// create a new J2000 (J2K) coordinate
let coordJ2K = new J2000(
  Date.UTC(2010, 2, 10, 22, 53, 14, 697), // UTC epoch
  8228,
  389,
  6888, // position (km)
  -0.7,
  6.6,
  -0.6 // velocity (km/s)
);

console.log(coordJ2K.toString());
//=> [J2000]
//   Epoch:  Wed, 10 Mar 2010 22:53:14 GMT
//   Position:  [ 8228, 389, 6888 ] km
//   Velocity:  [ -0.7, 6.6, -0.6 ] km/s

// convert to Earth Centered Inertial (ECI) coordinate frame
let coordECI = coordJ2K.toECI();

console.log(coordECI.toString());
//=> [EarthCenteredInertial]
//   Epoch:  Wed, 10 Mar 2010 22:53:14 GMT
//   Position:  [ 8220.011, 408.249, 6896.42 ] km
//   Velocity:  [ -0.715, 6.598, -0.601 ] km/s

// convert to a Keplerian Element Set
let coordKep = coordJ2K.toKeplerian();

console.log(coordKep.toString());
//=> [KeplerianElements]
//   Epoch:  Wed, 10 Mar 2010 22:53:14 GMT
//   (a) Semimajor Axis:  13360.643 km
//   (e) Eccentricity:  0.220498
//   (i) Inclination:  39.9375°
//   (Ω) Right Ascension:  269.8556°
//   (ω) Argument of Perigee:  125.7244°
//   (ν) True Anomaly:  326.4625°
