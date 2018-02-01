import { nutation } from "../bodies";
import { EARTH_ECC_SQ, EARTH_RAD_EQ, EARTH_ROTATION } from "../constants";
import { Epoch } from "../epoch";
import { Vector } from "../vector";
import { EarthCenteredInertial } from "./earth-centered-inertial";
import { Geodetic } from "./geodetic";
import { Spherical } from "./spherical";

export class EarthCenteredFixed {
    public position: Vector;
    public velocity: Vector;

    constructor(position: Vector, velocity: Vector) {
        this.position = position;
        this.velocity = velocity;
    }

    public toECI(epoch: Epoch): EarthCenteredInertial {
        const [dLon, dObliq, mObliq] = nutation(epoch);
        const obliq = mObliq + dObliq;
        const ast = epoch.getGMSTAngle() + dLon * Math.cos(obliq);
        const rotVec = EARTH_ROTATION.cross(this.position);
        const vpef = this.velocity.add(rotVec);
        const rtod = this.position.rot3(-ast);
        const vtod = vpef.rot3(-ast);
        return new EarthCenteredInertial(epoch, rtod, vtod);
    }

    public toGeodetic() {
        const [x, y, z] = this.position.state;
        const sma = EARTH_RAD_EQ;
        const esq = EARTH_ECC_SQ;
        const lon = Math.atan2(y, x);
        const r = Math.sqrt(x ** 2 + y ** 2);
        let phi = Math.atan(z / r);
        let lat = phi;
        let c = 0;
        for (let i = 0; i < 5; i++) {
            phi = lat;
            const slat = Math.sin(lat);
            c = 1 / Math.sqrt(1 - esq * slat * slat);
            lat = Math.atan((z + sma * c * esq * Math.sin(lat)) / r);
        }
        const alt = r / Math.cos(lat) - sma * c;
        return new Geodetic(lat, lon, alt);
    }

    public toSpherical() {
        const [x, y, z] = this.position.state;
        const radius = Math.sqrt(x * x + y * y + z * z);
        const inclination = Math.acos(z / radius);
        const azimuth = Math.atan(y / x);
        return new Spherical(radius, inclination, azimuth);
    }
}
