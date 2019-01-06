/** Value of 2 times Pi. */
export const TWO_PI = Math.PI * 2;

/** Unit for converting degrees to radians. */
export const DEG2RAD = Math.PI / 180;

/** Unit for converting radians to degrees. */
export const RAD2DEG = 180 / Math.PI;

/** Unit for converting 0.0001 arcseconds to radians. */
export const TTASEC2RAD = (1 / 60 / 60 / 10000) * DEG2RAD;

/** Unit for converting arcseconds to radians. */
export const ASEC2RAD = (1 / 60 / 60) * DEG2RAD;

/** Astronomical Unit, in kilometers. */
export const ASTRONOMICAL_UNIT = 149597870.0;

/** Moon gravitational parameter, in km^3/s^2. */
export const MOON_MU = 4902.801;

/** Sun gravitational parameter, in km^3/s^2. */
export const SUN_MU = 132712440017.987;

/**  Unit for converting seconds to days. */
export const SEC2DAY = 1 / 60 / 60 / 24;

/**  Unit for converting seconds to degrees. */
export const SEC2DEG = 1 / 60 / 60;

/** Solar flux constant, in watts/km^2. */
export const SOLAR_FLUX = 1.358;

/** Speed of light, in kilometers per second. */
export const SPEED_OF_LIGHT = 299792.458;
