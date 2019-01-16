import { EarthBody } from "../bodies/earth-body";
import { ASEC2RAD } from "../math/constants";
import { Vector3D } from "../math/vector-3d";
import { EGM_96_DENORMALIZED } from "./values/egm96";
import { EXPONENTIAL_ATMOSPHERE } from "./values/exponential-atmosphere";
import { clearFinals, FINALS, sortFinals, zeroFinal } from "./values/finals";
import { LEAP_SECONDS } from "./values/leap-seconds";

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
   * Get finals data for a given MJD.
   *
   * @param mjd USNO modified julian date
   */
  public static getFinalsData(mjd: number) {
    const fmjd = Math.floor(mjd);
    if (fmjd < FINALS[0].mjd || fmjd > FINALS[FINALS.length - 1].mjd) {
      return zeroFinal(fmjd);
    }
    let low = 0;
    let high = FINALS.length - 1;
    while (low <= high) {
      const mid = (high + low) / 2;
      const midVal = FINALS[mid].mjd;
      if (fmjd < midVal) {
        high = mid - 1;
      } else if (fmjd > midVal) {
        low = mid + 1;
      } else {
        return FINALS[mid];
      }
    }
    return zeroFinal(fmjd);
  }

  public static setFinalsData(lines: string[]) {
    clearFinals();
    for (let line of lines) {
      const tLine = line.trimRight();
      if (tLine.length <= 68) {
        continue;
      }
      const mjd = Math.floor(parseFloat(line.substring(7, 15)));
      const pmX = parseFloat(line.substring(18, 27)) * ASEC2RAD;
      const pmY = parseFloat(line.substring(37, 46)) * ASEC2RAD;
      const dut1 = parseFloat(line.substring(58, 68));
      let lod = 0;
      let dPsi = 0;
      let dEps = 0;
      if (tLine.length >= 86) {
        lod = parseFloat(line.substring(79, 86)) * 1e-3;
      }
      if (tLine.length >= 125) {
        dPsi = parseFloat(line.substring(97, 106)) * ASEC2RAD;
        dEps = parseFloat(line.substring(116, 125)) * ASEC2RAD;
      }
      FINALS.push({
        mjd: mjd,
        pmX: pmX,
        pmY: pmY,
        dut1: dut1,
        lod: lod,
        dPsi: dPsi,
        dEps: dEps
      });
    }
    sortFinals();
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
