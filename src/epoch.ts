import { DEG2RAD, LEAP_SECONDS, SEC2DAY } from './constants'
import { evalPoly } from './operations'

/** Class representing a astrodynamic epoch. */
export class Epoch {
  /** Seconds since 1 January 1970, 00:00 UTC. */
  public unix: number

  /**
   * Create a new Epoch object.
   *
   * @param millis milliseconds since 1 January 1970, 00:00 UTC
   */
  constructor (millis: number) {
    this.unix = millis / 1000
  }

  /** Return a new Epoch object, containing current time. */
  public static now (): Epoch {
    return new Epoch(new Date().getTime())
  }

  /** Convert to a new Date object. */
  public toDate (): Date {
    return new Date(this.unix * 1000)
  }

  /** Convert to milliseconds since 1 January 1970, 00:00 UTC. */
  public toMillis (): number {
    return this.toDate().getTime()
  }

  /** Convert to a UTC string. */
  public toString (): string {
    return this.toDate().toUTCString()
  }

  /**
   * Return a new Epoch, incremented by some desired number of seconds.
   *
   * @param seconds seconds to increment (can be negative)
   */
  public roll (seconds: number): Epoch {
    return new Epoch((this.unix + seconds) * 1000)
  }

  /** Convert to Julian date. */
  public toJulianDate (): number {
    return (this.unix / 86400) + 2440587.5
  }

  /** Get leap second offset. Lookup table found in: constants.LEAP_SECONDS */
  public getLeapSecondOffset (): number {
    const julian = this.toJulianDate()
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

  /** Convert to terrestrial centuries. */
  public toTerrestrialCenturies (): number {
    const julian = this.toJulianDate()
    const offset = this.getLeapSecondOffset() + 32.184
    const jdtt = julian + (offset * SEC2DAY)
    return (jdtt - 2451545.0) / 36525
  }

  /** Convert to Julian centuries. */
  public toJulianCenturies (): number {
    const julian = this.toJulianDate()
    return (julian - 2451545.0) / 36525
  }

  /** Calculate the Greenwich Mean Sidereal Time angle, in radians. */
  public getGMSTAngle (): number {
    const t = this.toJulianCenturies()
    const seconds = evalPoly(t,
      [67310.54841, ((876600.0 * 3600) + 8640184.812866),
        0.093104, -6.2e-6])
    return ((seconds % 86400) / 240) * DEG2RAD
  }
}
