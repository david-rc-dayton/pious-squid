import { MoonBody } from "../bodies/moon-body";
import { SunBody } from "../bodies/sun-body";
import { J2000 } from "../coordinates/j2000";
import { AccelerationForce, AccelerationMap } from "./forces-interface";

/** Model of third-body gravity, for use in a ForceModel object. */
export class ThirdBody implements AccelerationForce {
  /** model Moon gravity, if true */
  private moonGravityFlag: boolean;
  /** model Sun gravity, if true */
  private sunGravityFlag: boolean;

  /**
   * Create a new ThirdBody object.
   *
   * @param moonGravityFlag model Moon gravity, if true
   * @param sunGravityFlag model Sun gravity, if true
   */
  constructor(moonGravityFlag: boolean, sunGravityFlag: boolean) {
    this.moonGravityFlag = moonGravityFlag;
    this.sunGravityFlag = sunGravityFlag;
  }

  /**
   * Calculate acceleration due to the Moon's gravity.
   *
   * @param j2kState J2000 state vector
   */
  private moonGravity(j2kState: J2000) {
    const rMoon = MoonBody.position(j2kState.epoch);
    const aNum = rMoon.changeOrigin(j2kState.position);
    const aDen = Math.pow(aNum.magnitude(), 3);
    const bNum = rMoon;
    const bDen = Math.pow(rMoon.magnitude(), 3);
    const grav = aNum.scale(1.0 / aDen).add(bNum.scale(-1.0 / bDen));
    return grav.scale(MoonBody.MU);
  }

  /**
   * Calculate acceleration due to the Sun's gravity.
   *
   * @param j2kState J2000 state vector
   */
  private sunGravity(j2kState: J2000) {
    const rSun = SunBody.position(j2kState.epoch);
    const aNum = rSun.changeOrigin(j2kState.position);
    const aDen = Math.pow(aNum.magnitude(), 3);
    const bNum = rSun;
    const bDen = Math.pow(rSun.magnitude(), 3);
    const grav = aNum.scale(1.0 / aDen).add(bNum.scale(-1.0 / bDen));
    return grav.scale(SunBody.MU);
  }

  /**
   * Update the acceleration map argument with calculated "moon_gravity" and
   * "sun_gravity" values, for the provided state vector.
   *
   * @param j2kState J2000 state vector
   * @param accMap acceleration map (km/s^2)
   */
  public acceleration(j2kState: J2000, accMap: AccelerationMap) {
    if (this.moonGravityFlag) {
      accMap["moon_gravity"] = this.moonGravity(j2kState);
    }
    if (this.sunGravityFlag) {
      accMap["sun_gravity"] = this.sunGravity(j2kState);
    }
  }
}
