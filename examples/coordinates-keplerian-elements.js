// Example: using KeplerianElements

// import pious-squid module
const PiousSquid = require('..')
const KeplerianElements = PiousSquid.KeplerianElements
const DEG2RAD = PiousSquid.constants.DEG2RAD


// create new KeplerianElements
let coordKep = new KeplerianElements(
  Date.UTC(2018, 1, 7, 12, 0, 0, 0),  // UTC epoch
  6787.23371,                         // semimajor axis (kilometers)
  0.0008787,                          // eccentricity (unitless)
  51.34474 * DEG2RAD,                 // inclination (radians)
  304.51644 * DEG2RAD,                // right ascension (radians)
  54.44526 * DEG2RAD,                 // argument of perigee (radians)
  279.68095 * DEG2RAD                 // true anomaly (radians)
)

console.log(coordKep.toString())
//=> [KeplerianElements]
//   Epoch:  Wed, 07 Feb 2018 12:00:00 GMT
//   (a) Semimajor Axis:  6787.234 km
//   (e) Eccentricity:  0.000879
//   (i) Inclination:  51.3447°
//   (Ω) Right Ascension:  304.5164°
//   (ω) Argument of Perigee:  54.4453°
//   (ν) True Anomaly:  279.6809°


// calculate mean motion, in radians per second
let meanMotion = coordKep.meanMotion()

console.log(meanMotion)
//=> 0.0011290929142210111


// calculate the number of orbit revolutions per day
let revsPerDay = coordKep.revsPerDay()

console.log(revsPerDay)
//=> 15.52614207911775


// convert to J2000 (J2K) coordinate frame
let coordJ2K = coordKep.toJ2K()

console.log(coordJ2K.toString())
//=> [J2000]
//   Epoch:  Wed, 07 Feb 2018 12:00:00 GMT
//   Position:  [ 1935.716, -6079.271, -2312.645 ] km
//   Velocity:  [ 5.443, -0.309, 5.388 ] km/s
