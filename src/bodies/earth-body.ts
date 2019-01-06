import { IAU_1980 } from "../data/values/iau1980";
import { DEG2RAD, TTASEC2RAD } from "../math/constants";
import { evalPoly } from "../math/operations";
import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";

export class EarthBody {
  /** Earth gravitational parameter, in km^3/s^2. */
  public static readonly MU = 398600.4418;

  /** Earth equatorial radius, in kilometers. */
  public static readonly RADIUS_EQUATOR = 6378.137;

  /** Earth coefficient of flattening. */
  public static readonly FLATTENING = 1 / 298.257223563;

  /** Earth rotation vector, in radians per second. */
  public static readonly ROTATION = new Vector3D(0, 0, 7.2921158553e-5);

  /** Earth polar radius, in kilometers. */
  public static readonly RADIUS_POLAR =
    EarthBody.RADIUS_EQUATOR * (1 - EarthBody.FLATTENING);

  /** Earth mean radius, in kilometers. */
  public static readonly EARTH_RAD_MEAN =
    (2 * EarthBody.RADIUS_EQUATOR + EarthBody.RADIUS_POLAR) / 3;

  /** Earth eccentricity squared. */
  public static readonly ECCENTRICITY_SQUARED =
    EarthBody.FLATTENING * (2 - EarthBody.FLATTENING);

  /**
   * Calculate the [zeta, theta, zed] angles of precession, in radians.
   *
   * @param epoch satellite state epoch
   */
  public static precession(epoch: EpochUTC): [number, number, number] {
    const t = epoch.toTDB().toJulianCenturies();
    const zeta = evalPoly(t, [0.0, 0.6406161, 0.0000839, 5.0e-6]);
    const theta = evalPoly(t, [0.0, 0.556753, -0.0001185, -1.16e-5]);
    const zed = evalPoly(t, [0.0, 0.6406161, 0.0003041, 5.1e-6]);
    return [zeta * DEG2RAD, theta * DEG2RAD, zed * DEG2RAD];
  }

  /**
   * Calculate the [deltaPsi, deltaEpsilon, meanEpsilon] angles of nutation,
   * in radians.
   *
   * @param epoch satellite state epoch
   */
  public static nutation(epoch: EpochUTC): [number, number, number] {
    const r = 360;
    const t = epoch.toTDB().toJulianCenturies();
    const moonAnom = evalPoly(t, [
      134.96340251,
      1325.0 * r + 198.8675605,
      0.0088553,
      1.4343e-5
    ]);
    const sunAnom = evalPoly(t, [
      357.52910918,
      99.0 * r + 359.0502911,
      -0.0001537,
      3.8e-8
    ]);
    const moonLat = evalPoly(t, [
      93.27209062,
      1342.0 * r + 82.0174577,
      -0.003542,
      -2.88e-7
    ]);
    const sunElong = evalPoly(t, [
      297.85019547,
      1236.0 * r + 307.1114469,
      -0.0017696,
      1.831e-6
    ]);
    const moonRaan = evalPoly(t, [
      125.04455501,
      -(5.0 * r + 134.1361851),
      0.0020756,
      2.139e-6
    ]);
    let deltaPsi = 0;
    let deltaEpsilon = 0;
    IAU_1980.map(iauLine => {
      let [a1, a2, a3, a4, a5, Ai, Bi, Ci, Di] = iauLine;
      const arg =
        (a1 * moonAnom +
          a2 * sunAnom +
          a3 * moonLat +
          a4 * sunElong +
          a5 * moonRaan) *
        DEG2RAD;
      const sinC = Ai + Bi * t;
      const cosC = Ci + Di * t;
      deltaPsi += sinC * Math.sin(arg);
      deltaEpsilon += cosC * Math.cos(arg);
    });
    deltaPsi = deltaPsi * TTASEC2RAD;
    deltaEpsilon = deltaEpsilon * TTASEC2RAD;
    const meanEpsilon =
      evalPoly(t, [23.439291, -0.013004, -1.64e-7, 5.04e-7]) * DEG2RAD;
    return [deltaPsi, deltaEpsilon, meanEpsilon];
  }
}
