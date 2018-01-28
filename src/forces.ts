import { Vector } from './vector'
import {
    EARTH_J2, EARTH_J3, EARTH_J4, EARTH_MU, EARTH_RAD_EQ, MOON_MU, SUN_MU,
    SOLAR_FLUX, ASTRONOMICAL_UNIT, SPEED_OF_LIGHT, EARTH_ROTATION
} from './constants'
import { Epoch } from './epoch'
import { moonPosition, sunPosition, atmosphericDensity } from './bodies'
import { J2000 } from './coordinates/j2000'

export function j2Effect(position: Vector): Vector {
    let i = position.state[0]
    let j = position.state[1]
    let k = position.state[2]
    let r = position.magnitude()
    let aPre = -((3 * EARTH_J2 * EARTH_MU
        * Math.pow(EARTH_RAD_EQ, 2)) / (2 * Math.pow(r, 5)))
    let aijPost = 1 - ((5 * Math.pow(k, 2)) / Math.pow(r, 2))
    let akPost = 3 - ((5 * Math.pow(k, 2)) / Math.pow(r, 2))
    return new Vector([
        aPre * i * aijPost,
        aPre * j * aijPost,
        aPre * k * akPost
    ])
}

export function j3Effect(position: Vector): Vector {
    let i = position.state[0]
    let j = position.state[1]
    let k = position.state[2]
    let r = position.magnitude()
    let aPre = -((5 * EARTH_J3 * EARTH_MU
        * Math.pow(EARTH_RAD_EQ, 3)) / (2 * Math.pow(r, 7)))
    let aijPost = (3 * k) - ((7 * Math.pow(k, 3)) / Math.pow(r, 2))
    let akPost = ((6 * Math.pow(k, 2)) - ((7 * Math.pow(k, 4)) / Math.pow(r, 2))
        - ((3 / 5) * Math.pow(r, 2)))
    return new Vector([
        aPre * i * aijPost,
        aPre * j * aijPost,
        aPre * akPost
    ])
}

export function j4Effect(position: Vector): Vector {
    let i = position.state[0]
    let j = position.state[1]
    let k = position.state[2]
    let r = position.magnitude()
    let aPre = (15 * EARTH_J4 * EARTH_MU
        * Math.pow(EARTH_RAD_EQ, 4)) / (8 * Math.pow(r, 7))
    let aijPost = (1 - ((14 * Math.pow(k, 2)) / Math.pow(r, 2))
        + ((21 * Math.pow(k, 4)) / Math.pow(r, 4)))
    let akPost = (5 - ((70 * Math.pow(k, 2)) / (3 * Math.pow(r, 2))) +
        ((21 * Math.pow(k, 4)) / Math.pow(r, 4)))
    return new Vector([
        aPre * i * aijPost,
        aPre * j * aijPost,
        aPre * k * akPost
    ])
}

export function gravityEarth(position: Vector): Vector {
    let dist = position.magnitude()
    return position.scale(-EARTH_MU / Math.pow(dist, 3))
}

export function gravityMoon(epoch: Epoch, position: Vector): Vector {
    let rMoon = moonPosition(epoch)
    let aNum = rMoon.add(position.scale(-1))
    let aDen = Math.pow(aNum.magnitude(), 3)
    let bNum = rMoon
    let bDen = Math.pow(rMoon.magnitude(), 3)
    let grav = aNum.scale(1 / aDen).add(bNum.scale(-1 / bDen))
    return grav.scale(MOON_MU)
}

export function gravitySun(epoch: Epoch, position: Vector): Vector {
    let rSun = sunPosition(epoch)
    let aNum = rSun.add(position.scale(-1))
    let aDen = Math.pow(aNum.magnitude(), 3)
    let bNum = rSun
    let bDen = Math.pow(rSun.magnitude(), 3)
    let grav = aNum.scale(1 / aDen).add(bNum.scale(-1 / bDen))
    return grav.scale(SUN_MU)
}

function shadowFactor(rSat: Vector, rSun: Vector): number {
    let n = Math.pow(rSat.magnitude(), 2) - rSat.dot(rSun)
    let d = (Math.pow(rSat.magnitude(), 2)
        + Math.pow(rSun.magnitude(), 2) - 2 * rSat.dot(rSun))
    let tMin = (n / d)
    let c = (1 - tMin) * Math.pow(rSat.magnitude(), 2) + rSat.dot(rSun) * tMin
    if (tMin < 0 || tMin > 1) {
        return 1
    }
    if (c >= Math.pow(EARTH_RAD_EQ, 2)) {
        return 1
    }
    return 0
}

export function solarRadiation(epoch: Epoch, position: Vector,
    mass = 1000.0, area = 1.0, reflect = 1.4): Vector {
    let rSat = position
    let rSun = sunPosition(epoch)
    let sFactor = shadowFactor(rSat, rSun)
    let rDist = rSat.add(rSun.scale(-1))
    let fScale =
        (SOLAR_FLUX * Math.pow(ASTRONOMICAL_UNIT, 2) * reflect * (area / 1000.0)) /
        (mass * Math.pow(rDist.magnitude(), 2) * SPEED_OF_LIGHT)
    let unitVec = rDist.normalize()
    return unitVec.scale(sFactor * fScale)
}

export function atmosphericDrag(position: Vector, velocity: Vector,
    mass = 1000.0, area = 1.0, drag = 2.2): Vector {
    let rot_vel = EARTH_ROTATION.cross(position)
    let v_rel = velocity.add(rot_vel.scale(-1)).scale(1000)
    let v_mag = v_rel.magnitude()
    let density = atmosphericDensity(position)
    let f_scale = -0.5 * ((drag * area) / mass) * density * Math.pow(v_mag, 2)
    let vel_vec = v_rel.normalize()
    return vel_vec.scale(f_scale / 1000)
}

export function derivative(j2kState: J2000): Vector {
    let epoch = j2kState.epoch
    let position = j2kState.position
    let velocity = j2kState.velocity
    let acceleration = gravityEarth(position)
        .add(j2Effect(position))
        .add(j3Effect(position))
        .add(j4Effect(position))
        .add(gravitySun(epoch, position))
        .add(gravityMoon(epoch, position))
        .add(solarRadiation(epoch, position))
        .add(atmosphericDrag(position, velocity))
    return velocity.concat(acceleration)
}
