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
        const rx = radius * Math.sin(inclination) * Math.cos(azimuth);
        const ry = radius * Math.sin(inclination) * Math.sin(azimuth);
        const rz = radius * Math.cos(inclination);
        return new EarthCenteredFixed(rx, ry, rz);
    }
}
