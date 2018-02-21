// Example: using the Kepler propagator

// import pious-squid module
const PiousSquid = require('..')
const DEG2RAD = PiousSquid.constants.DEG2RAD
const KeplerianElements = PiousSquid.KeplerianElements
const Kepler = PiousSquid.Kepler


// create the initial state
let initState = new KeplerianElements(
  Date.UTC(2018, 1, 7, 12, 0, 0, 0),  // UTC epoch
  6787.23371,                         // semimajor axis (kilometers)
  0.0008787,                          // eccentricity (unitless)
  51.34474 * DEG2RAD,                 // inclination (radians)
  304.51644 * DEG2RAD,                // right ascension (radians)
  54.44526 * DEG2RAD,                 // argument of perigee (radians)
  279.68095 * DEG2RAD                 // true anomaly (radians)
)

console.log(initState.toString())
//=> [KeplerianElements]
//   Epoch:  Wed, 07 Feb 2018 12:00:00 GMT
//   Semimajor Axis:  6787.234 km
//   Eccentricity:  0.000879
//   Inclination:  51.3447°
//   Right Ascension:  304.5164°
//   Argument of Perigee:  54.4453°
//   True Anomaly:  279.6809°


// initialize the propagator, using default two-body settings
let kepProp = new Kepler(initState)

console.log(kepProp.toString())
//=> [Kepler]:  Two-Body Propagator


// propagate the state one day forward
let newState = kepProp.propagate(Date.UTC(2018, 1, 7, 13, 0, 0, 0))

console.log(newState.toString())
//=> [J2000]
//   Epoch:  Wed, 07 Feb 2018 13:00:00 GMT
//   Position:  [ -5020.445, 3881.912, -2421.653 ] km
//   Velocity:  [ -1.528, -5.29, -5.321 ] km/s
