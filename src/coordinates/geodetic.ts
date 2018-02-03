import { EARTH_ECC_SQ, EARTH_RAD_EQ } from "../constants";
import { EarthCenteredFixed } from "./earth-centered-fixed";

/** Class representing Geodetic (LLA) coordinates. */
export class Geodetic {
    /** Geodetic latitude, in radians. */
    public latitude: number;
    /** Geodetic longitude, in radians. */
    public longitude: number;
    /** Geodetic altitude, in kilometers. */
    public altitude: number;

    /**
     * Create a new Geodetic object.
     *
     * @param latitude geodetic latitude, in radians
     * @param longitude geodetic longitude, in radians
     * @param altitude geodetic altitude, in kilometers
     */
    constructor(latitude: number, longitude: number, altitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
    }

    /** Convert to the Earth Centered Earth Fixed (ECEF) coordinate frame. */
    public toECEF(): EarthCenteredFixed {
        const { latitude, longitude, altitude } = this;
        const sLat = Math.sin(latitude);
        const cLat = Math.cos(latitude);
        const nVal = EARTH_RAD_EQ / Math.sqrt(1 - EARTH_ECC_SQ * sLat * sLat);
        const rx = (nVal + altitude) * cLat * Math.cos(longitude);
        const ry = (nVal + altitude) * cLat * Math.sin(longitude);
        const rz = (nVal * (1 - EARTH_ECC_SQ) + altitude) * sLat;
        return new EarthCenteredFixed(rx, ry, rz);
    }
}
