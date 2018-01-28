import { Vector } from "../vector"
import { EarthCenteredFixed } from "./earth-centered-fixed"

export class Spherical {
    public radius: number
    public inclination: number
    public azimuth: number

    constructor(radius: number, inclination: number, azimuth: number) {
        this.radius = radius
        this.inclination = inclination
        this.azimuth = azimuth
    }

    public toECEF(): EarthCenteredFixed {
        const pVec = new Vector([
            this.radius * Math.sin(this.inclination) * Math.cos(this.azimuth),
            this.radius * Math.sin(this.inclination) * Math.sin(this.azimuth),
            this.radius * Math.cos(this.inclination),
        ])
        return new EarthCenteredFixed(pVec, Vector.origin(3))
    }
}
