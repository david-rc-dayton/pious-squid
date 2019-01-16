import { DataHandler } from "../data/data-handler";
import { DEG2RAD, TWO_PI } from "../math/constants";
import { evalPoly } from "../math/operations";
import { AbstractEpoch } from "./abstract-epoch";
import { EpochTAI, EpochTDB, EpochTT, EpochUT1 } from "./time-scales";

/** Class representing a UTC astrodynamic epoch. */
export class EpochUTC extends AbstractEpoch {
  /**
   * Create a new Epoch object.
   *
   * @param millis milliseconds since 1 January 1970, 00:00 UTC
   */
  constructor(millis: number) {
    super(millis);
  }

  /**
   * Create a new EpochUTC object from a valid JavaScript Date string.
   *
   * @param dateStr
   */
  public static fromDateString(dateStr: string) {
    return new EpochUTC(new Date(dateStr).getTime());
  }

  /** Return a new Epoch object, containing current time. */
  public static now(): EpochUTC {
    return new EpochUTC(new Date().getTime());
  }

  /**
   * Return a new Epoch, incremented by some desired number of seconds.
   *
   * @param seconds seconds to increment (can be negative)
   */
  public roll(seconds: number): EpochUTC {
    return new EpochUTC((this.unix + seconds) * 1000);
  }

  /** Convert to UNSO Modified Julian Date. */
  public toMjd() {
    return this.toJulianDate() - 2400000.5;
  }

  /** Convert to GSFC Modified Julian Date. */
  public toMjdGsfc() {
    return this.toJulianDate() - 2400000.5 - 29999.5;
  }

  /** Convert to a UT1 Epoch. */
  public toUT1() {
    const { dut1 } = DataHandler.getFinalsData(this.toMjd());
    return new EpochUT1((this.unix + dut1) * 1000);
  }

  /** Convert to an International Atomic Time (TAI) Epoch. */
  public toTAI() {
    const ls = DataHandler.leapSecondsOffset(this.toJulianDate());
    return new EpochTAI((this.unix + ls) * 1000);
  }

  /** Convert to a Terrestrial Time (TT) Epoch. */
  public toTT() {
    return new EpochTT((this.toTAI().unix + 32.184) * 1000);
  }

  /** Convert to a Barycentric Dynamical Time (TDB) Epoch. */
  public toTDB() {
    const tt = this.toTT();
    const tTT = tt.toJulianCenturies();
    const mEarth = (357.5277233 + 35999.05034 * tTT) * DEG2RAD;
    const seconds =
      0.001658 * Math.sin(mEarth) + 0.00001385 * Math.sin(2 * mEarth);
    return new EpochTDB((tt.unix + seconds) * 1000);
  }

  /**
   * Calculate the Greenwich Mean Sideral Time (GMST) angle for this epoch,
   * in radians.
   */
  public gmstAngle() {
    const t = this.toUT1().toJulianCenturies();
    const seconds = evalPoly(t, [
      67310.54841,
      876600.0 * 3600.0 + 8640184.812866,
      0.093104,
      6.2e-6
    ]);
    return ((seconds % 86400) / 86400) * TWO_PI;
  }
}
