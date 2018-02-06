import { nutation } from "../bodies";
import { EARTH_ECC_SQ, EARTH_RAD_EQ, EARTH_ROTATION } from "../constants";
import { Epoch } from "../epoch";
import { Vector } from "../vector";
import { EarthCenteredInertial } from "./earth-centered-inertial";
import { Geodetic } from "./geodetic";
import { Spherical } from "./spherical";
import { TopocentricHorizon } from "./topocentric-horizon";

/** Class representing Earth Centered Earth Fixed (ECEF) coordinates. */
export class EarthCenteredFixed {
    /** Position 3-vector, in kilometers. */
    public position: Vector;
    /** Velocity 3-vector, in kilometers per second. */
    public velocity: Vector;

    /**
     * Create a new EarthCenteredFixed object.
     *
     * @param rx x-axis position, in kilometers
     * @param ry y-axis position, in kilometers
     * @param rz z-axis position, in kilometers
     * @param vx x-axis velocity, in kilometers per second (default = 0)
     * @param vy y-axis velocity, in kilometers per second (default = 0)
     * @param vz z-axis velocity, in kilometers per second (default = 0)
     */
    constructor(rx: number, ry: number, rz: number,
                vx = 0, vy = 0, vz = 0) {
        this.position = new Vector(rx, ry, rz);
        this.velocity = new Vector(vx, vy, vz);
    }

    /**
     * Convert to the Earth Centered Inertial (ECI) coordinate frame.
     *
     * @param millis milliseconds since 1 January 1970, 00:00 UTC
     */
    public toECI(millis: number): EarthCenteredInertial {
        const { position, velocity } = this;
        const epoch = new Epoch(millis);
        const [dLon, dObliq, mObliq] = nutation(epoch);
        const obliq = mObliq + dObliq;
        const ast = epoch.getGMSTAngle() + dLon * Math.cos(obliq);
        const rotVec = EARTH_ROTATION.cross(position);
        const vpef = velocity.add(rotVec);
        const rtod = position.rot3(-ast);
        const vtod = vpef.rot3(-ast);
        const [ri, rj, rk, vi, vj, vk] = rtod.concat(vtod).state;
        return new EarthCenteredInertial(millis, ri, rj, rk, vi, vj, vk);
    }

    /** Convert to the Geodetic (LLA) coordinate frame. */
    public toGeodetic(): Geodetic {
        const [x, y, z] = this.position.state;
        const sma = EARTH_RAD_EQ;
        const esq = EARTH_ECC_SQ;
        const lon = Math.atan2(y, x);
        const r = Math.sqrt(x ** 2 + y ** 2);
        let phi = Math.atan(z / r);
        let lat = phi;
        let c = 0;
        for (let i = 0; i < 8; i++) {
            phi = lat;
            const slat = Math.sin(lat);
            c = 1 / Math.sqrt(1 - esq * slat * slat);
            lat = Math.atan((z + sma * c * esq * Math.sin(lat)) / r);
        }
        const alt = r / Math.cos(lat) - sma * c;
        return new Geodetic(lat, lon, alt);
    }

    /** Convert to the Spherical coordinate frame. */
    public toSpherical(): Spherical {
        const [x, y, z] = this.position.state;
        const radius = Math.sqrt(x * x + y * y + z * z);
        const inclination = Math.acos(z / radius);
        const azimuth = Math.atan(y / x);
        return new Spherical(radius, inclination, azimuth);
    }

    /**
     * Convert to a Topocentric coordinate frame relative to an observer.
     *
     * @param observer coordinate frame origin
     */
    public toTopocentric(observer: Geodetic): TopocentricHorizon {
        const { latitude, longitude } = observer;
        const { sin, cos } = Math;
        const [oX, oY, oZ] = observer.toECEF().position.state;
        const [tX, tY, tZ] = this.position.state;
        const [rX, rY, rZ] = [tX - oX, tY - oY, tZ - oZ];
        const s = ((sin(latitude) * cos(longitude) * rX)
            + (sin(latitude) * sin(longitude) * rY)) - (cos(latitude) * rZ);
        const e = (-sin(longitude) * rX) + (cos(longitude) * rY);
        const z = (cos(latitude) * cos(longitude) * rX)
            + (cos(latitude) * sin(longitude) * rY) + (sin(latitude) * rZ);
        return new TopocentricHorizon(s, e, z);
    }
}
