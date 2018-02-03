import { Vector } from "../vector";
import { EarthCenteredFixed } from "./earth-centered-fixed";

export class Spherical {
    public radius: number;
    public inclination: number;
    public azimuth: number;

    constructor(radius: number, inclination: number, azimuth: number) {
        this.radius = radius;
        this.inclination = inclination;
        this.azimuth = azimuth;
    }

    public toECEF(): EarthCenteredFixed {
        const { radius, inclination, azimuth } = this;
        const [rx, ry, rz] = new Vector(
            radius * Math.sin(inclination) * Math.cos(azimuth),
            radius * Math.sin(inclination) * Math.sin(azimuth),
            radius * Math.cos(inclination),
        ).state;
        return new EarthCenteredFixed(rx, ry, rz);
    }
}
