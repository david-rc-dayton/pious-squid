import { RAD2DEG } from "../constants";
import { CoordinateType, ICoordinate } from "./coordinate-config";
import { EarthCenteredFixed } from "./earth-centered-fixed";

/** Class representing spherical coordinates. */
export class Spherical implements ICoordinate {
    /** Coordinate identifier string. */
    public readonly type: string;
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
        this.type = CoordinateType.SPHERICAL;
        this.radius = radius;
        this.inclination = inclination;
        this.azimuth = azimuth;
    }

    /** Return a string representation of the object. */
    public toString(): string {
        const { radius, inclination, azimuth } = this;
        const theta = inclination * RAD2DEG;
        const phi = azimuth * RAD2DEG;
        return [
            "[Spherical]",
            `  (r) Radius:  ${(radius).toFixed(3)} km`,
            `  (\u03b8) Inclination:  ${theta.toFixed(3)}\u00b0`,
            `  (\u03c6) Azimuth:  ${phi.toFixed(3)}\u00b0`,
        ].join("\n");
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
