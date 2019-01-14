import { SunBody } from "../bodies/sun-body";
import { J2000 } from "../coordinates/j2000";
import { AccelerationForce, AccelerationMap } from "../forces/forces-interface";

/** Model of solar radiation pressure, for use in a ForceModel object. */
export class SolarRadiationPressure implements AccelerationForce {
  /** spacecraft mass, in kilograms */
  private mass: number;
  /** spacecraft area, in square meters */
  private area: number;
  /** reflectivity coefficient (unitless) */
  private reflectCoeff: number;

  /**
   * Create a new solar radiation pressure AccelerationForce object.
   *
   * @param mass spacecraft mass, in kilograms
   * @param area spacecraft area, in square meters
   * @param reflectCoeff reflectivity coefficient (unitless)
   */
  constructor(mass: number, area: number, reflectCoeff: number) {
    this.mass = mass;
    this.area = area;
    this.reflectCoeff = reflectCoeff;
  }

  /**
   * Calculate acceleration due to solar radiation pressure.
   *
   * @param j2kState J2000 state vector
   */
  private radiationPressure(j2kState: J2000) {
    const { mass, area, reflectCoeff } = this;
    const rSun = SunBody.position(j2kState.epoch);
    const r = rSun.changeOrigin(j2kState.position);
    const pFac = -(SunBody.SOLAR_PRESSURE * reflectCoeff * area) / mass;
    return r.normalized().scale(pFac / 1000);
  }

  /**
   * Update the acceleration map argument with a calculated
   * "solar_radiation_pressure" value, for the provided state vector.
   *
   * @param j2kState J2000 state vector
   * @param accMap acceleration map (km/s^2)
   */
  public acceleration(j2kState: J2000, accMap: AccelerationMap) {
    accMap["solar_radiation_pressure"] = this.radiationPressure(j2kState);
  }
}
