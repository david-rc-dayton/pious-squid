import { Vector } from './vector'

/** Value of 2 times Pi. */
export const TWO_PI = Math.PI * 2

/**  Unit for converting degrees to radians. */
export const DEG2RAD = Math.PI / 180

/**  Unit for converting radians to degrees. */
export const RAD2DEG = 180 / Math.PI

/**  Unit for converting 0.0001 minutes to radians. */
export const MM2R = (1 / 60 / 60 / 10000) * DEG2RAD

/** Astronomical Unit, in kilometers. */
export const ASTRONOMICAL_UNIT = 149597870.0

/** Earth equatorial radius, in kilometers. */
export const EARTH_RAD_EQ = 6378.1363

/** Earth coefficient of flattening. */
export const EARTH_FLAT = 1 / 298.257223563

/** Earth polar radius, in kilometers. */
export const EARTH_RAD_POL = EARTH_RAD_EQ * (1 - EARTH_FLAT)

/** Earth eccentricity, squared. */
export const EARTH_ECC_SQ = (Math.pow(EARTH_RAD_EQ, 2)
  - Math.pow(EARTH_RAD_POL, 2)) / Math.pow(EARTH_RAD_EQ, 2)

/** Earth J2 coefficient. */
export const EARTH_J2 = 0.001082627

/** Earth J3 coefficient. */
export const EARTH_J3 = -0.000002532

/** Earth J4 coefficient. */
export const EARTH_J4 = -0.000001620

/** Earth gravitational parameter, in km^3/s^2. */
export const EARTH_MU = 398600.4415

/** Earth rotation vector, in radians per second. */
export const EARTH_ROTATION = new Vector(0, 0, 7.29211514670698e-5)

/** Moon gravitational parameter, in km^3/s^2. */
export const MOON_MU = 4902.801

/** Sun gravitational parameter, in km^3/s^2. */
export const SUN_MU = 132712440017.987

/**  Unit for converting seconds to days. */
export const SEC2DAY = 1 / 60 / 60 / 24

/**  Unit for converting seconds to degrees. */
export const SEC2DEG = 1 / 60 / 60

/** Solar flux constant, in watts/km^2. */
export const SOLAR_FLUX = 1.358

/** Speed of light, in kilometers per second. */
export const SPEED_OF_LIGHT = 299792.458

/**
 * Coefficients for the exponential atmospheric density model. Contains the
 * base altitude (km), nominal density (kg/m^3), and scale height (km).
 */
export const EXP_ATMOSPHERE = [
  [0, 1.225, 7.249],
  [25, 3.899e-2, 6.349],
  [30, 1.774e-2, 6.682],
  [40, 3.972e-3, 7.554],
  [50, 1.057e-3, 8.382],
  [60, 3.206e-4, 7.714],
  [70, 8.770e-5, 6.549],
  [80, 1.905e-5, 5.799],
  [90, 3.396e-6, 5.382],
  [100, 5.297e-7, 5.877],
  [110, 9.661e-8, 7.263],
  [120, 2.438e-8, 9.473],
  [130, 8.484e-9, 12.636],
  [140, 3.845e-9, 16.149],
  [150, 2.070e-9, 22.523],
  [180, 5.464e-10, 29.740],
  [200, 2.789e-10, 37.105],
  [250, 7.248e-11, 45.546],
  [300, 2.418e-11, 53.628],
  [350, 9.518e-12, 53.298],
  [400, 3.725e-12, 58.515],
  [450, 1.585e-12, 60.828],
  [500, 6.967e-13, 63.822],
  [600, 1.454e-13, 71.835],
  [700, 3.614e-14, 88.667],
  [800, 1.170e-14, 124.64],
  [900, 5.245e-15, 181.05],
  [1000, 3.019e-15, 268.0]
]

/** Coefficients for calculating Earth nutation. */
export const IAU_1980 = [
  [0, 0, 0, 0, 1, -171996.0, -174.2, 92025.0, 8.9],
  [0, 0, 2, -2, 2, -13187.0, -1.6, 5736.0, -3.1],
  [0, 0, 2, 0, 2, -2274.0, -0.2, 977.0, -0.5],
  [0, 0, 0, 0, 2, 2062.0, 0.2, -895.0, 0.5],
  [0, 1, 0, 0, 0, 1426.0, -3.4, 54.0, -0.1],
  [1, 0, 0, 0, 0, 712.0, 0.1, -7.0, 0.0],
  [0, 1, 2, -2, 2, -517.0, 1.2, 224.0, -0.6],
  [0, 0, 2, 0, 1, -386.0, -0.4, 200.0, 0.0],
  [1, 0, 2, 0, 2, -301.0, 0.0, 129.0, -0.1],
  [0, -1, 2, -2, 2, 217.0, -0.5, -95.0, 0.3],
  [1, 0, 0, -2, 0, -158.0, 0.0, -1.0, 0.0],
  [0, 0, 2, -2, 1, 129.0, 0.1, -70.0, 0.0],
  [-1, 0, 2, 0, 2, 123.0, 0.0, -53.0, 0.0],
  [1, 0, 0, 0, 1, 63.0, 0.1, -33.0, 0.0],
  [0, 0, 0, 2, 0, 63.0, 0.0, -2.0, 0.0],
  [-1, 0, 2, 2, 2, -59.0, 0.0, 26.0, 0.0],
  [-1, 0, 0, 0, 1, -58.0, -0.1, 32.0, 0.0],
  [1, 0, 2, 0, 1, -51.0, 0.0, 27.0, 0.0],
  [2, 0, 0, -2, 0, 48.0, 0.0, 1.0, 0.0],
  [-2, 0, 2, 0, 1, 46.0, 0.0, -24.0, 0.0]
]

/**
 * Historical list of leap seconds. Contains a tuple of the Julian Date, and
 * seconds offset.
 */
export const LEAP_SECONDS = [
  [2437300.5, 1.4228180],
  [2437512.5, 1.3728180],
  [2437665.5, 1.8458580],
  [2438334.5, 1.8458580],
  [2438395.5, 3.2401300],
  [2438486.5, 3.3401300],
  [2438639.5, 3.4401300],
  [2438761.5, 3.5401300],
  [2438820.5, 3.6401300],
  [2438942.5, 3.7401300],
  [2439004.5, 3.8401300],
  [2439126.5, 4.3131700],
  [2439887.5, 4.2131700],
  [2441317.5, 10.0],
  [2441499.5, 11.0],
  [2441683.5, 12.0],
  [2442048.5, 13.0],
  [2442413.5, 14.0],
  [2442778.5, 15.0],
  [2443144.5, 16.0],
  [2443509.5, 17.0],
  [2443874.5, 18.0],
  [2444239.5, 19.0],
  [2444786.5, 20.0],
  [2445151.5, 21.0],
  [2445516.5, 22.0],
  [2446247.5, 23.0],
  [2447161.5, 24.0],
  [2447892.5, 25.0],
  [2448257.5, 26.0],
  [2448804.5, 27.0],
  [2449169.5, 28.0],
  [2449534.5, 29.0],
  [2450083.5, 30.0],
  [2450630.5, 31.0],
  [2451179.5, 32.0],
  [2453736.5, 33.0],
  [2454832.5, 34.0],
  [2456109.5, 35.0],
  [2457204.5, 36.0],
  [2457754.5, 37.0]
]
