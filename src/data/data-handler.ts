import { EarthBody } from "../bodies/earth-body";
import { Vector3D } from "../math/vector-3d";
import { EGM_96_DENORMALIZED } from "./values/egm96";
import { EXPONENTIAL_ATMOSPHERE } from "./values/exponential-atmosphere";
import { LEAP_SECONDS } from "./values/leap-seconds";

interface FinalsData {
  /** USNO modified julaian date */
  mjd: number;
  /** polar motion x-component */
  pmX: number;
  /** polar motion y-component */
  pmY: number;
  /** delta ut1 time (seconds) */
  dut1: number;
}

export class DataHandler {
  /**
   * Fetch the number of leap seconds used in offset.
   *
   * @param jd julian date
   */
  public static leapSecondsOffset(jd: number) {
    if (jd > LEAP_SECONDS[LEAP_SECONDS.length - 1][0]) {
      return LEAP_SECONDS[LEAP_SECONDS.length - 1][1];
    }
    if (jd < LEAP_SECONDS[0][0]) {
      return 0;
    }
    for (let i = 0; i < LEAP_SECONDS.length - 2; i++) {
      if (LEAP_SECONDS[i][0] <= jd && jd < LEAP_SECONDS[i + 1][0]) {
        return LEAP_SECONDS[i][1];
      }
    }
    return 0;
  }

  /**
   * Add a new entry to the leap seconds table.
   *
   * @param jd julian date
   * @param offset leap seconds offset, in seconds
   */
  public static addLeapSecond(jd: number, offset: number) {
    LEAP_SECONDS.push([jd, offset]);
  }

  /**
   * Get finals data. Currently returns all values as zero.
   *
   * @param mjd USNO modified julian date
   */
  public static getFinalsData(mjd: number): FinalsData {
    const fmjd = Math.floor(mjd);
    return { mjd: fmjd, pmX: 0, pmY: 0, dut1: 0 };
  }

  /**
   * Calculate the density of the Earth's atmosphere, in kg/m^3, for a given
   * position using the exponential atmospheric density model.
   *
   * @param position satellite position 3-vector, in kilometers
   */
  public static getExpAtmosphericDensity(position: Vector3D): number {
    const rDist = position.magnitude() - EarthBody.RADIUS_EQUATOR;
    const expAtm = EXPONENTIAL_ATMOSPHERE;
    const maxVal = expAtm.length - 1;
    let fields = [0.0, 0.0, 0.0];
    if (rDist <= expAtm[0][0]) {
      fields = expAtm[0];
    } else if (rDist >= expAtm[maxVal][0]) {
      fields = expAtm[maxVal];
    } else {
      for (let i = 0; i < maxVal; i++) {
        if (expAtm[i][0] <= rDist && rDist < expAtm[i + 1][0]) {
          fields = expAtm[i];
        }
      }
    }
    const base = fields[0];
    const density = fields[1];
    const height = fields[2];
    return density * Math.exp(-(rDist - base) / height);
  }

  /** Calculate appropritate 1D index for 2D coefficient lookup. */
  private static egm96Index(l: number, m: number) {
    return ((l - 2) * (l + 2) + l) / 2 - 1 + m;
  }

  /**
   * Lookup denormalized EGM96 coefficients.
   *
   * @param l first P index
   * @param m second P index
   */
  public static getEgm96Coeffs(l: number, m: number) {
    return EGM_96_DENORMALIZED[DataHandler.egm96Index(l, m)];
  }
}
