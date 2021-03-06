import {
  EpochUTC,
  J2000,
  KeplerPropagator,
  RungeKutta4Propagator,
  Vector3D
} from "../index";

//==============================================================================
// define an initial state
//==============================================================================

// initial state in J2000 frame
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

// real-world expected state (24-hours into the future)
const expectedState = new J2000(
  EpochUTC.fromDateString("2018-12-22T00:00:00.000Z"),
  new Vector3D(-212.125533, -2464.351601, 6625.907454),
  new Vector3D(-3.618617698, -6.12677853, -2.38955619)
);

console.log(expectedState.toString());
// => [J2000]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -212.125533000, -2464.351601000, 6625.907454000 ] km
//   Velocity:  [ -3.618617698, -6.126778530, -2.389556190 ] km/s

//==============================================================================
// propagate state vector (numerical high-accuracy)
//==============================================================================

// create a propagator using J2000 state
const hiAccProp = new RungeKutta4Propagator(initialState);

// set step size
hiAccProp.setStepSize(5); // seconds

// add earth gravity
hiAccProp.forceModel.setEarthGravity(
  50, // degree
  50 // order
);

// add sun & moon gravity
hiAccProp.forceModel.setThirdBody(
  true, // moon
  true // sun
);

// add atmospheric drag
hiAccProp.forceModel.setAtmosphericDrag(
  2200, // mass (kg)
  3.7, // area (m^2)
  2.2 // drag coefficient
);

// add solar radiation pressure
hiAccProp.forceModel.setSolarRadiationPressure(
  2200, // mass (kg)
  3.7, // area (m^2)
  1.2 // reflectivity coefficient
);

// propagated state (24-hours into the future)
const resultState = hiAccProp.propagate(
  EpochUTC.fromDateString("2018-12-22T00:00:00.000Z")
);

console.log(resultState.toString());
// => [J2000]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -212.131159564, -2464.369431512, 6625.894946242 ] km
//   Velocity:  [ -3.618619589, -6.126775239, -2.389579324 ] km/s

// calculate the distance between result and expected, in kilometers
const distance = resultState.position.distance(expectedState.position);

console.log((distance * 1000).toFixed(3) + " meters");
// => 22.495 meters

//==============================================================================
// propagate state vector (numerical two-body)
//==============================================================================

const twoBodyProp = new RungeKutta4Propagator(initialState);
twoBodyProp.forceModel.setEarthGravity(0, 0);
twoBodyProp.propagate(EpochUTC.fromDateString("2018-12-22T00:00:00.000Z"));

console.log(twoBodyProp.state.toString());
// => [J2000]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -1241.886675379, -3977.873474857, 5689.561067368 ] km
//   Velocity:  [ -3.502813706, -5.085314761, -4.303326274 ] km/s

//==============================================================================
// propagate classical elements (analytical two-body)
//==============================================================================

// convert j2000 state to classical elements
const ceState = initialState.toClassicalElements();

// create a propagator using classical elements, and propagate
const keplerProp = new KeplerPropagator(ceState);
keplerProp.propagate(EpochUTC.fromDateString("2018-12-22T00:00:00.000Z"));

console.log(keplerProp.state.toString());
// => [J2000]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -1241.885644014, -3977.871988515, 5689.562370838 ] km
//   Velocity:  [ -3.502814112, -5.085316082, -4.303324341 ] km/s
