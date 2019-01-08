const {
  J2000,
  EpochUTC,
  Vector3D,
  RungeKutta4,
  Kepler
} = require("./dist/index");

//==============================================================================
// define a j2000 state
//==============================================================================

// create using epoch, position (km), and velocity (km/s)
const j2kState = new J2000(
  EpochUTC.fromDateString("2018-12-21T00:00:00.000Z"),
  new Vector3D(-1117.913276, 73.093299, -7000.018272),
  new Vector3D(3.531365461, 6.583914964, -0.495649656)
);

console.log(j2kState.toString());
// => [J2000]
//   Epoch:  2018-12-21T00:00:00.000Z
//   Position:  [ -1117.913276000, 73.093299000, -7000.018272000 ] km
//   Velocity:  [ 3.531365461, 6.583914964, -0.495649656 ] km/s

//==============================================================================
// propagate state vector (high-accuracy)
//==============================================================================

// create a propagator using J2000 state
const rk4Prop = new RungeKutta4(j2kState);

// add forces to the force-model
rk4Prop.setStepSize(5); // seconds
rk4Prop.forceModel.setEarthGravity(50, 50); // degree, order
rk4Prop.forceModel.setThirdBody(true, true); // moon, sun

// propagate to a new epoch
rk4Prop.propagate(new EpochUTC.fromDateString("2018-12-22T00:00:00.000Z"));

console.log(rk4Prop.state.toString());
// => [J2000]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -212.112562070, -2464.337728252, 6625.906840422 ] km
//   Velocity:  [ -3.618621399, -6.126789977, -2.389541193 ] km/s

//==============================================================================
// propagate classical elements (fast two-body)
//==============================================================================

// convert j2000 state to classical elements
const ceState = j2kState.toClassicalElements();

// create a propagator using classical elements
const keplerProp = new Kepler(ceState);

// propagate to a new epoch
keplerProp.propagate(new EpochUTC.fromDateString("2018-12-22T00:00:00.000Z"));

console.log(keplerProp.state.toString());
// => [J2000]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -1241.885644014, -3977.871988515, 5689.562370838 ] km
//   Velocity:  [ -3.502814112, -5.085316082, -4.303324341 ] km/s

// compare against numerical two-body
const twoProp = new RungeKutta4(j2kState);
twoProp.forceModel.setEarthGravity(1, 1);
twoProp.propagate(new EpochUTC.fromDateString("2018-12-22T00:00:00.000Z"));

console.log(twoProp.state.toString());
// => [J2000]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -1241.886675379, -3977.873474857, 5689.561067368 ] km
//   Velocity:  [ -3.502813706, -5.085314761, -4.303326274 ] km/s
