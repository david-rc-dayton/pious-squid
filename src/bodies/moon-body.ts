import { EpochUTC } from "../time/epoch-utc";
import { Vector3D } from "../math/vector-3d";
import { RADIUS_EQUATOR } from "../bodies/earth-body";
import { DEG2RAD } from "../math/constants";

/** Moon gravitational parameter, in km^3/s^2. */
export const MU = 4902.801;

/**
 * Calculate the J2000 position of the Moon, in kilometers, at a given epoch.
 *
 * @param epoch satellite state epoch
 */
export function position(epoch: EpochUTC) {
  const jc = epoch.toUT1().toJulianCenturies();
  const dtr = DEG2RAD;
  const lamEcl =
    218.32 +
    481267.883 * jc +
    6.29 * Math.sin((134.9 + 477198.85 * jc) * dtr) -
    1.27 * Math.sin((259.2 - 413335.38 * jc) * dtr) +
    0.66 * Math.sin((235.7 + 890534.23 * jc) * dtr) +
    0.21 * Math.sin((269.9 + 954397.7 * jc) * dtr) -
    0.19 * Math.sin((357.5 + 35999.05 * jc) * dtr) -
    0.11 * Math.sin((186.6 + 966404.05 * jc) * dtr);
  const phiEcl =
    5.13 * Math.sin((93.3 + 483202.03 * jc) * dtr) +
    0.28 * Math.sin((228.2 + 960400.87 * jc) * dtr) -
    0.28 * Math.sin((318.3 + 6003.18 * jc) * dtr) -
    0.17 * Math.sin((217.6 - 407332.2 * jc) * dtr);
  const pllx =
    0.9508 +
    0.0518 * Math.cos((134.9 + 477198.85 * jc) * dtr) +
    0.0095 * Math.cos((259.2 - 413335.38 * jc) * dtr) +
    0.0078 * Math.cos((235.7 + 890534.23 * jc) * dtr) +
    0.0028 * Math.cos((269.9 + 954397.7 * jc) * dtr);
  const obq = 23.439291 - 0.0130042 * jc;
  const rMag = 1.0 / Math.sin(pllx * dtr);
  const rI = rMag * (Math.cos(phiEcl * dtr) * Math.cos(lamEcl * dtr));
  const rJ =
    rMag *
    (Math.cos(obq * dtr) * Math.cos(phiEcl * dtr) * Math.sin(lamEcl * dtr) -
      Math.sin(obq * dtr) * Math.sin(phiEcl * dtr));
  const rK =
    rMag *
    (Math.sin(obq * dtr) * Math.cos(phiEcl * dtr) * Math.sin(lamEcl * dtr) +
      Math.cos(obq * dtr) * Math.sin(phiEcl * dtr));
  return new Vector3D(rI, rJ, rK).scale(RADIUS_EQUATOR);
}
