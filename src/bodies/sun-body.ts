import { EarthBody } from "../bodies/earth-body";
import { J2000 } from "../coordinates/j2000";
import { ASTRONOMICAL_UNIT, DEG2RAD, SPEED_OF_LIGHT } from "../math/constants";
import { Vector3D } from "../math/vector-3d";
import { EpochUTC } from "../time/epoch-utc";

export class SunBody {
  /** Moon gravitational parameter, in km^3/s^2. */
  public static readonly MU = 132712440017.987;

  public static readonly SOLAR_FLUX = 1353;

  public static readonly SOLAR_PRESSURE = SunBody.SOLAR_FLUX / SPEED_OF_LIGHT;

  public static readonly UMBRA_ANGLE = 0.26411888 * DEG2RAD;

  public static readonly PENUMBRA_ANGLE = 0.26900424 * DEG2RAD;

  /**
   * Calculate the J2000 position of the Sun, in kilometers, at a given epoch.
   *
   * @param epoch satellite state epoch
   */
  public static position(epoch: EpochUTC) {
    const jc = epoch.toUT1().toJulianCenturies();
    const dtr = DEG2RAD;
    const lamSun = 280.46 + 36000.77 * jc;
    const mSun = 357.5277233 + 35999.05034 * jc;
    const lamEc =
      lamSun +
      1.914666471 * Math.sin(mSun * dtr) +
      0.019994643 * Math.sin(2 * mSun * dtr);
    const obliq = 23.439291 - 0.0130042 * jc;
    const rMag =
      1.000140612 -
      0.016708617 * Math.cos(mSun * dtr) -
      0.000139589 * Math.cos(2 * mSun * dtr);
    const rI = rMag * Math.cos(lamEc * dtr);
    const rJ = rMag * Math.cos(obliq * dtr) * Math.sin(lamEc * dtr);
    const rK = rMag * Math.sin(obliq * dtr) * Math.sin(lamEc * dtr);
    return new Vector3D(rI, rJ, rK).scale(ASTRONOMICAL_UNIT);
  }

  public static shadow(j2kState: J2000) {
    const { epoch, position: posSat } = j2kState;
    const posSun = SunBody.position(epoch);
    let shadow = false;
    if (posSun.dot(posSat) < 0) {
      const angle = posSun.angle(posSat);
      const r = posSat.magnitude();
      const satHoriz = r * Math.cos(angle);
      const satVert = r * Math.sin(angle);
      const penVert =
        EarthBody.RADIUS_EQUATOR + Math.tan(SunBody.PENUMBRA_ANGLE) * satHoriz;
      if (satVert <= penVert) {
        shadow = true;
      }
    }
    return shadow;
  }
}
