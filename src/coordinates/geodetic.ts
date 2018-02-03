import { EARTH_ECC_SQ, EARTH_RAD_EQ } from "../constants";
import { Vector } from "../vector";
import { EarthCenteredFixed } from "./earth-centered-fixed";

export class Geodetic {
    public latitude: number;
    public longitude: number;
    public altitude: number;

    constructor(latitude: number, longitude: number, altitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
    }

    public toECEF() {
        const sLat = Math.sin(this.latitude);
        const cLat = Math.cos(this.latitude);
        const nVal = EARTH_RAD_EQ / Math.sqrt(1 - EARTH_ECC_SQ * sLat * sLat);
        const [rx, ry, rz] = new Vector([
            (nVal + this.altitude) * cLat * Math.cos(this.longitude),
            (nVal + this.altitude) * cLat * Math.sin(this.longitude),
            (nVal * (1 - EARTH_ECC_SQ) + this.altitude) * sLat,
        ]).state;
        return new EarthCenteredFixed(rx, ry, rz);
    }
}
