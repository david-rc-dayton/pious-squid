import { EarthCenteredFixed } from "./earth-centered-fixed";

/** Class representing spherical coordinates. */
export class Spherical {
    /** Distance from origin, in kilometers. */
    public readonly radius: number;
    /** Inclination angle, in radians. */
    public readonly inclination: number;
    /** Azimuth angle, in radians. */
    public readonly azimuth: number;

    /**
     * Create a new Spherical object.
     *
     * @param radius distance from origin, in kilometers
     * @param inclination inclination angle, in radians
     * @param azimuth azimuth angle, in radians
     */
    constructor(radius: number, inclination: number, azimuth: number) {
        this.radius = radius;
        this.inclination = inclination;
        this.azimuth = azimuth;
    }

    /** Convert to the Earth Centered Earth Fixed (ECEF) coordinate frame. */
    public toECEF(): EarthCenteredFixed {
        const { radius, inclination, azimuth } = this;
        const rx = radius * Math.sin(inclination) * Math.cos(azimuth);
        const ry = radius * Math.sin(inclination) * Math.sin(azimuth);
        const rz = radius * Math.cos(inclination);
        return new EarthCenteredFixed(rx, ry, rz);
    }
}
