# Pious Squid

Orbital mechanics and satellite mission analysis library, for NodeJS and the
browser.

## Features

+ **Coordinate Frames**
    - Earth Centered Earth Fixed *(ECEF)*
    - Earth Centered Inertial *(ECI)*
    - Geodetic *(LLA)*
    - J2000
    - Keplerian Elements
    - Look Angles
    - Spherical
    - Topocentric-Horizon *(SEZ)*

+ **Ephemeris Propagators**
    - Keplerian *(analytic)*
    - 4th Order Runge-Kutta *(numerical)*

+ **Celestial Bodies**
    - Earth Precession / Nutation
    - Earth Atmospheric Density
    - Moon Position
    - Sun Position

+ **Time**
    - Julian Date
    - Leap Seconds
    - Terrestrial Centuries
    - Julian Centuries
    - Greenwich Mean Sidereal Time

+ **Model Forces**
    - J2 / J3 / J4 Effect
    - Earth Gravity
    - Moon Gravity
    - Sun Gravity
    - Solar Radiation Pressure
    - Atmospheric Drag

## Install

To include `pious-squid` in your *NodeJS* project:

    npm install pious-squid --save

The browser library bundles (`pious-squid.js` or `pious-squid.min.js`) can be
found under, the 
[Releases](https://github.com/david-rc-dayton/pious-squid/releases)
tab on *GitHub*.

## Example

To propagate a satellite from its position and velocity vectors:

```javascript
// import pious-squid modules
const PiousSquid = require('..')
const J2000 = PiousSquid.J2000
const RungeKutta4 = PiousSquid.RungeKutta4
const Satellite = PiousSquid.Satellite


// create the satellite's initial state
let initState = new J2000(
    Date.UTC(2010, 2, 10, 22, 53, 14, 697),
    8228, 389, 6888,
    -0.7, 6.6, -0.6
)
// =>  Epoch: Wed, 10 Mar 2010 22:53:14 GMT
//     Position: [ 8228, 389, 6888 ] km
//     Velocity: [ -0.7, 6.6, -0.6 ] km/s


// initialize the RK4 propagator, changing the stepsize to 300 seconds
let rk4Prop = new RungeKutta4(initState, { stepSize: 300 })
// => Epoch: Wed, 10 Mar 2010 22:53:14 GMT
//    Position: [ 8228, 389, 6888 ] km
//    Velocity: [ -0.7, 6.6, -0.6 ] km/s
//    Step Size: 300.000 seconds
//    Satellite Mass: 1000.000 kg
//    Satellite Surface Area: 1.000 m^2
//    Drag Coefficient: 2.200
//    Reflectivity Coefficient: 1.400
//    J2 Effect: ENABLED
//    J3 Effect: ENABLED
//    J4 Effect: ENABLED
//    Sun Gravity: ENABLED
//    Moon Gravity: ENABLED
//    Solar Radiation Pressure: ENABLED
//    Atmospheric Drag: ENABLED

// create the satellite object; the name is optional
let satellite = new Satellite(rk4Prop, { name: "Example Satellite" })
// =>  Satellite: Example Satellite
//     Propagator: rk4
//     Epoch: Wed, 10 Mar 2010 22:53:14 GMT
//     Position: [ 8228, 389, 6888 ] km
//     Velocity: [ -0.7, 6.6, -0.6 ] km/s


// propagate the satellite state one day forward
satellite.propagate(Date.UTC(2010, 2, 11, 22, 53, 14, 697))
// => Satellite: Example Satellite
//    Propagator: rk4
//    Epoch: Thu, 11 Mar 2010 22:53:14 GMT
//    Position: [ -7924.483, -12493.015, -6492.194 ] km
//    Velocity: [ 2.75, -2.552, 2.332 ] km/s


// get the satellite's geodetic coordinates at the new state
satellite.toGeodetic()
// =>  Latitude: -23.781°
//     Longitude: 84.966°
//     Altitude: 9781.486 km
```

Examples can be found in the 
[examples](https://github.com/david-rc-dayton/pious-squid/tree/master/examples)
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
