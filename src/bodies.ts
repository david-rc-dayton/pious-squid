import * as c from "./math/constants";
import { EpochUTC } from "./time/epoch-utc";

/**
 * Calculate the J2000 position of the Sun, in kilometers, at a given epoch.
 *
 * @param epoch satellite state epoch
 */
export function sunPosition(epoch: EpochUTC): Vector {
  const { sin, cos } = Math;
  const jCent = epoch.julianCenturies;
  const lamSun = (280.46 + 36000.77 * jCent) % 360;
  const mSun = ((357.5277233 + 35999.05034 * jCent) % 360) * c.DEG2RAD;
  const lamEc =
    ((lamSun + 1.914666471 * sin(mSun) + 0.019994643 * sin(2 * mSun)) % 360) *
    c.DEG2RAD;
  const obliq = (23.439291 - 0.0130042 * jCent) * c.DEG2RAD;
  const rMag =
    1.000140612 - 0.016708617 * cos(mSun) - 0.000139589 * cos(2 * mSun);
  return new Vector(
    rMag * cos(lamEc) * c.ASTRONOMICAL_UNIT,
    rMag * cos(obliq) * sin(lamEc) * c.ASTRONOMICAL_UNIT,
    rMag * sin(obliq) * sin(lamEc) * c.ASTRONOMICAL_UNIT
  );
}
