import { DEG2RAD, LEAP_SECONDS, SEC2DAY } from "./constants"
import { evalPoly } from "./operations"

export class Epoch {
    public epoch: number

    constructor(ms: number) {
        this.epoch = ms / 1000
    }

    public static now(): Epoch {
        return new Epoch(new Date().getTime())
    }

    public toString(): string {
        return new Date(this.epoch * 1000).toUTCString()
    }

    public roll(seconds: number): Epoch {
        return new Epoch((this.epoch + seconds) * 1000)
    }

    public toJulianDate(): number {
        return (this.epoch / 86400) + 2440587.5
    }

    public getLeapSecondOffset(): number {
        let julian = this.toJulianDate()
        if (julian < LEAP_SECONDS[0][0]) {
            return 0
        }
        if (julian > LEAP_SECONDS[LEAP_SECONDS.length - 1][0]) {
            return LEAP_SECONDS[LEAP_SECONDS.length - 1][1]
        }
        for (let i = 0; i < LEAP_SECONDS.length - 1; i++) {
            if (LEAP_SECONDS[i][0] <= julian
                && julian < LEAP_SECONDS[i + 1][0]) {
                return LEAP_SECONDS[i][1]
            }
        }
        return 0
    }

    public toTerrestrialCenturies(): number {
        let julian = this.toJulianDate()
        let offset = this.getLeapSecondOffset() + 32.184
        let jdtt = julian + (offset * SEC2DAY)
        return (jdtt - 2451545.0) / 36525
    }

    public toJulianCenturies(): number {
        let julian = this.toJulianDate()
        return (julian - 2451545.0) / 36525
    }

    public getGMSTAngle(): number {
        let t = this.toJulianCenturies()
        let seconds = evalPoly(t,
            [67310.54841, ((876600.0 * 3600) + 8640184.812866),
                0.093104, -6.2e-6])
        return ((seconds % 86400) / 240) * DEG2RAD
    }
}
