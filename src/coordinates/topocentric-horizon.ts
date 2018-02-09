import { CoordinateType, ICoordinate } from "./coordinate-config";
import { LookAngle } from "./look-angle";

/** Class representing topocentric-horizon coordinates. */
export class TopocentricHorizon implements ICoordinate {
    /** Coordinate identifier string. */
    public readonly type: CoordinateType;
    /** South component, in kilometers. */
    public readonly s: number;
    /** East component, in kilometers. */
    public readonly e: number;
    /** Surface-normal component, in kilometers. */
    public readonly z: number;

    /**
     * Create a new Topocentric object.
     *
     * @param s south component, in kilometers
     * @param e east component, in kilometers
     * @param z surface-normal component, in kilometers
     */
    constructor(s: number, e: number, z: number) {
        this.type = CoordinateType.TOPOCENTRIC_HORIZON;
        this.s = s;
        this.e = e;
        this.z = z;
    }

    /** Convert to look angles. */
    public toLookAngle(): LookAngle {
        const { s, e, z } = this;
        const range = Math.sqrt(s * s + e * e + z * z);
        const elevation = Math.asin(z / range);
        const azimuth = Math.atan2(-e, s) + Math.PI;
        return new LookAngle(azimuth, elevation, range);
    }
}
