import { Geodetic } from "../coordinates/geodetic";
import { IGroundStationOptions } from "./construct-config";

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
}
