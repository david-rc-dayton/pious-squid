import { Geodetic } from "../coordinates/geodetic";
import { LookAngle } from "../coordinates/look-angle";
import { IGroundStationOptions } from "./construct-config";
import { Satellite } from "./satellite";

export class GroundStation {
    public location: Geodetic;
    public name: string;
    public minEl: number;

    constructor(location: Geodetic, opts?: IGroundStationOptions) {
        this.location = location;
        opts = opts || {};
        this.name = opts.name || "";
        this.minEl = opts.minEl || 0;
    }

    public lookAngles(satellite: Satellite): LookAngle {
        return satellite.toECEF().toTopocentric(this.location).toLookAngle();
    }

    public isVisible(satellite: Satellite): boolean {
        const { elevation } = this.lookAngles(satellite);
        return elevation >= this.minEl;
    }
}
