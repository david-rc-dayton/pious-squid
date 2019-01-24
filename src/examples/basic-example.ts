import {
  EpochUTC,
  Geodetic,
  J2000,
  RungeKutta4Propagator,
  Vector3D
} from "../index";

// =============================================================================
// set initial state in J2000 frame
// =============================================================================

const initialState = new J2000(
  EpochUTC.fromDateString("2018-12-21T00:00:00.000Z"), // epoch (UTC)
  new Vector3D(-1117.913276, 73.093299, -7000.018272), // km
  new Vector3D(3.531365461, 6.583914964, -0.495649656) // km/s
);

console.log(initialState.toString());
// => [J2000]
//   Epoch:  2018-12-21T00:00:00.000Z
//   Position:  [ -1117.913276000, 73.093299000, -7000.018272000 ] km
//   Velocity:  [ 3.531365461, 6.583914964, -0.495649656 ] km/s

// =============================================================================
// create a propagator object
// =============================================================================

const propagator = new RungeKutta4Propagator(initialState);

// set the step size
propagator.setStepSize(5); // seconds

// add Earth gravity acceleration
propagator.forceModel.setEarthGravity(
  50, // degree
  50 // order
);

// add third-body acceleration
propagator.forceModel.setThirdBody(
  true, // moon gravity
  true // sun gravity
);

// =============================================================================
// propagate ephemeris to a future time
// =============================================================================

const finalState = propagator.propagate(
  EpochUTC.fromDateString("2018-12-22T00:00:00.000Z")
);

console.log(finalState.toString());
// => [J2000]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -212.111629987, -2464.336270508, 6625.907441304 ] km
//   Velocity:  [ -3.618621245, -6.126790740, -2.389539402 ] km/s

// =============================================================================
// display information about the propagated state
// =============================================================================

// Earth-fixed coordinates
console.log(finalState.toITRF().toString());
// => [ITRF]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -2463.105532067, 235.348124556, 6625.580458844 ] km
//   Velocity:  [ -6.093169860, 3.821763334, -2.395927109 ] km/s

// geodetic coordinates
console.log(
  finalState
    .toITRF()
    .toGeodetic()
    .toString()
);
// => [Geodetic]
//   Latitude:  69.635°
//   Longitude:  174.542°
//   Altitude:  713.165 km

// look angle from ground observer
const observer = new Geodetic(
  71.218 * (Math.PI / 180), // latitude (radians)
  180.508 * (Math.PI / 180), // longitude (radians)
  0.325 // altitude (km)
);
console.log(
  finalState
    .toITRF()
    .toLookAngle(observer)
    .toString()
);
// [Look-Angle]
//   Azimuth:  234.477°
//   Elevation:  65.882°
//   Range:  773.318 km

// relative position
const actualState = new J2000(
  EpochUTC.fromDateString("2018-12-22T00:00:00.000Z"),
  new Vector3D(-212.125533, -2464.351601, 6625.907454),
  new Vector3D(-3.618617698, -6.12677853, -2.38955619)
);
console.log(finalState.toRIC(actualState).toString());
// => [RIC]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -0.005770585, -0.019208198, 0.005105235 ] km
//   Velocity:  [ 0.000020089, 0.000006319, 0.000000117 ] km/s
