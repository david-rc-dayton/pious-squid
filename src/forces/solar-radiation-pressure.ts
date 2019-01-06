import { SunBody } from "../bodies/sun-body";
import { J2000 } from "../coordinates/j2000";
import { AccelerationForce, AccelerationMap } from "../forces/forces-interface";

export class SolarRadiationPressure implements AccelerationForce {
  private mass: number;
  private area: number;
  private reflectCoeff: number;

  constructor(mass: number, area: number, reflectCoeff: number) {
    this.mass = mass;
    this.area = area;
    this.reflectCoeff = reflectCoeff;
  }

  private radiationPressure(j2kState: J2000) {
    const { mass, area, reflectCoeff } = this;
    const rSun = SunBody.position(j2kState.epoch);
    const r = rSun.changeOrigin(j2kState.position);
    const pFac = -(SunBody.SOLAR_PRESSURE * reflectCoeff * area) / mass;
    return r.normalized().scale(pFac / 1000);
  }

  public acceleration(j2kState: J2000, accMap: AccelerationMap) {
    accMap["solar_radiation_pressure"] = this.radiationPressure(j2kState);
  }
}
