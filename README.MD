# Pious Squid

[![npm version](https://badge.fury.io/js/pious-squid.svg)](https://badge.fury.io/js/pious-squid)

Orbital mechanics and satellite mission analysis library, for NodeJS and the
browser.

## Features

- **Coordinate Frames**

  - Classical Orbit Elements
  - Earth Centered Earth Fixed _(ITRF)_
  - Geodetic
  - J2000
  - Look Angles
  - True Equator Mean Equinox _(TEME)_
  - Relative Motion _(RIC)_

- **Ephemeris Propagators**

  - 4th Order Runge-Kutta _(numerical)_
  - Keplerian _(analytic)_
  - Interpolator

- **Celestial Bodies**

  - Earth Atmospheric Density
  - Earth Precession / Nutation
  - Moon Position
  - Solar Eclipse
  - Sun Position

- **Epoch**

  - Barycentric Dynamical Time _(TDB)_
  - Greenwich Mean Sidereal Time
  - International Atomic Time _(TAI)_
  - Julian Centuries
  - Julian Date
  - Leap Seconds
  - Terrestrial Time _(TT)_
  - UTC/UT1 Time

- **Force Model**

  - Atmospheric Drag
  - Earth Geopotential (70x70)
  - Moon Gravity
  - Solar Radiation Pressure
  - Sun Gravity

## Install

To include `pious-squid` in your _NodeJS_ project:

    npm install pious-squid --save

The browser library bundles (`pious-squid.js` or `pious-squid.min.js`) can be
found under, the
[Releases](https://github.com/david-rc-dayton/pious-squid/releases)
tab on _GitHub_.

## Example

To propagate a satellite from its position and velocity vectors:

```javascript
const PiousSquid = require("pious-squid");
const EpochUTC = PiousSquid.EpochUTC;
const J2000 = PiousSquid.J2000;
const Kepler = PiousSquid.KeplerPropagator;
const RungeKutta4 = PiousSquid.RungeKutta4Propagator;
const Vector3D = PiousSquid.Vector3D;

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
const hiAccProp = new RungeKutta4(initialState);

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
  3.7 // area (m^2)
);

// add solar radiation pressure
hiAccProp.forceModel.setSolarRadiationPressure(
  2200, // mass (kg)
  3.7 // area (m^2)
);

// propagated state (24-hours into the future)
const resultState = hiAccProp.propagate(
  new EpochUTC.fromDateString("2018-12-22T00:00:00.000Z")
);

console.log(resultState.toString());
// => [J2000]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -212.131047437, -2464.369130369, 6625.895065916 ] km
//   Velocity:  [ -3.618619800, -6.126775254, -2.389578954 ] km/s

// calculate the distance between result and expected, in kilometers
const distance = resultState.position.distance(expectedState.position);

console.log((distance * 1000).toFixed(3) + " meters");
// => 22.162 meters

//==============================================================================
// propagate state vector (numerical two-body)
//==============================================================================

const twoBodyProp = new RungeKutta4(initialState);
twoBodyProp.forceModel.setEarthGravity(0, 0);
twoBodyProp.propagate(new EpochUTC.fromDateString("2018-12-22T00:00:00.000Z"));

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
const keplerProp = new Kepler(ceState);
keplerProp.propagate(new EpochUTC.fromDateString("2018-12-22T00:00:00.000Z"));

console.log(keplerProp.state.toString());
// => [J2000]
//   Epoch:  2018-12-22T00:00:00.000Z
//   Position:  [ -1241.885644014, -3977.871988515, 5689.562370838 ] km
//   Velocity:  [ -3.502814112, -5.085316082, -4.303324341 ] km/s
```

Additional examples can be found in the
[examples](https://github.com/david-rc-dayton/pious-squid/tree/master/src/examples)
directory in the project root directory.

## License

**The MIT License (MIT)**

Copyright © 2018 David RC Dayton

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
