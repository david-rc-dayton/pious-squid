import { atmosphericDensity, moonPosition, sunPosition } from "./bodies";
import {
    ASTRONOMICAL_UNIT, EARTH_J2, EARTH_J3, EARTH_J4, EARTH_MU, EARTH_RAD_EQ, EARTH_ROTATION,
    MOON_MU, SOLAR_FLUX, SPEED_OF_LIGHT, SUN_MU,
} from "./constants";
import { J2000 } from "./coordinates/j2000";
import { Epoch } from "./epoch";
import { Vector } from "./vector";

export function j2Effect(position: Vector): Vector {
    const i = position.state[0];
    const j = position.state[1];
    const k = position.state[2];
    const r = position.magnitude();
    const aPre = -((3 * EARTH_J2 * EARTH_MU
        * Math.pow(EARTH_RAD_EQ, 2)) / (2 * Math.pow(r, 5)));
    const aijPost = 1 - ((5 * Math.pow(k, 2)) / Math.pow(r, 2));
    const akPost = 3 - ((5 * Math.pow(k, 2)) / Math.pow(r, 2));
    return new Vector([
        aPre * i * aijPost,
        aPre * j * aijPost,
        aPre * k * akPost,
    ]);
}

export function j3Effect(position: Vector): Vector {
    const i = position.state[0];
    const j = position.state[1];
    const k = position.state[2];
    const r = position.magnitude();
    const aPre = -((5 * EARTH_J3 * EARTH_MU
        * Math.pow(EARTH_RAD_EQ, 3)) / (2 * Math.pow(r, 7)));
    const aijPost = (3 * k) - ((7 * Math.pow(k, 3)) / Math.pow(r, 2));
    const akPost = ((6 * Math.pow(k, 2)) - ((7 * Math.pow(k, 4)) / Math.pow(r, 2))
        - ((3 / 5) * Math.pow(r, 2)));
    return new Vector([
        aPre * i * aijPost,
        aPre * j * aijPost,
        aPre * akPost,
    ]);
}

export function j4Effect(position: Vector): Vector {
    const i = position.state[0];
    const j = position.state[1];
    const k = position.state[2];
    const r = position.magnitude();
    const aPre = (15 * EARTH_J4 * EARTH_MU
        * Math.pow(EARTH_RAD_EQ, 4)) / (8 * Math.pow(r, 7));
    const aijPost = (1 - ((14 * Math.pow(k, 2)) / Math.pow(r, 2))
        + ((21 * Math.pow(k, 4)) / Math.pow(r, 4)));
    const akPost = (5 - ((70 * Math.pow(k, 2)) / (3 * Math.pow(r, 2))) +
        ((21 * Math.pow(k, 4)) / Math.pow(r, 4)));
    return new Vector([
        aPre * i * aijPost,
        aPre * j * aijPost,
        aPre * k * akPost,
    ]);
}

export function gravityEarth(position: Vector): Vector {
    const dist = position.magnitude();
    return position.scale(-EARTH_MU / Math.pow(dist, 3));
}

export function gravityMoon(epoch: Epoch, position: Vector): Vector {
    const rMoon = moonPosition(epoch);
    const aNum = rMoon.add(position.scale(-1));
    const aDen = Math.pow(aNum.magnitude(), 3);
    const bNum = rMoon;
    const bDen = Math.pow(rMoon.magnitude(), 3);
    const grav = aNum.scale(1 / aDen).add(bNum.scale(-1 / bDen));
    return grav.scale(MOON_MU);
}

export function gravitySun(epoch: Epoch, position: Vector): Vector {
    const rSun = sunPosition(epoch);
    const aNum = rSun.add(position.scale(-1));
    const aDen = Math.pow(aNum.magnitude(), 3);
    const bNum = rSun;
    const bDen = Math.pow(rSun.magnitude(), 3);
    const grav = aNum.scale(1 / aDen).add(bNum.scale(-1 / bDen));
    return grav.scale(SUN_MU);
}

function shadowFactor(rSat: Vector, rSun: Vector): number {
    const n = Math.pow(rSat.magnitude(), 2) - rSat.dot(rSun);
    const d = (Math.pow(rSat.magnitude(), 2)
        + Math.pow(rSun.magnitude(), 2) - 2 * rSat.dot(rSun));
    const tMin = (n / d);
    const c = (1 - tMin) * Math.pow(rSat.magnitude(), 2) + rSat.dot(rSun) * tMin;
    if (tMin < 0 || tMin > 1) {
        return 1;
    }
    if (c >= Math.pow(EARTH_RAD_EQ, 2)) {
        return 1;
    }
    return 0;
}

export function solarRadiation(epoch: Epoch, position: Vector,
                               mass = 1000.0, area = 1.0, reflect = 1.4): Vector {
    const rSat = position;
    const rSun = sunPosition(epoch);
    const sFactor = shadowFactor(rSat, rSun);
    const rDist = rSat.add(rSun.scale(-1));
    const fScale =
        (SOLAR_FLUX * Math.pow(ASTRONOMICAL_UNIT, 2) * reflect * (area / 1000.0)) /
        (mass * Math.pow(rDist.magnitude(), 2) * SPEED_OF_LIGHT);
    const unitVec = rDist.normalize();
    return unitVec.scale(sFactor * fScale);
}

export function atmosphericDrag(position: Vector, velocity: Vector,
                                mass = 1000.0, area = 1.0, drag = 2.2): Vector {
    const rotVel = EARTH_ROTATION.cross(position);
    const vRel = velocity.add(rotVel.scale(-1)).scale(1000);
    const vMag = vRel.magnitude();
    const density = atmosphericDensity(position);
    const fScale = -0.5 * ((drag * area) / mass) * density * Math.pow(vMag, 2);
    const velVec = vRel.normalize();
    return velVec.scale(fScale / 1000);
}

export function derivative(j2kState: J2000): Vector {
    const epoch = j2kState.epoch;
    const position = j2kState.position;
    const velocity = j2kState.velocity;
    const acceleration = gravityEarth(position)
        .add(j2Effect(position))
        .add(j3Effect(position))
        .add(j4Effect(position))
        .add(gravitySun(epoch, position))
        .add(gravityMoon(epoch, position))
        .add(solarRadiation(epoch, position))
        .add(atmosphericDrag(position, velocity));
    return velocity.concat(acceleration);
}
