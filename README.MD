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
import {
  EpochUTC,
  Geodetic,
  J2000,
  RungeKutta4Propagator,
  Vector3D
} from "pious-squid";

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
// => [Look-Angle]
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
