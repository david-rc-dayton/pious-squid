import { MoonBody } from "../bodies/moon-body";
import { SunBody } from "../bodies/sun-body";
import { J2000 } from "../coordinates/j2000";
import { AccelerationForce, AccelerationMap } from "./forces-interface";

export class ThirdBody implements AccelerationForce {
  private moonGravityFlag: boolean;
  private sunGravityFlag: boolean;

  constructor(moonGravityFlag: boolean, sunGravityFlag: boolean) {
    this.moonGravityFlag = moonGravityFlag;
    this.sunGravityFlag = sunGravityFlag;
  }

  private moonGravity(j2kState: J2000) {
    const rMoon = MoonBody.position(j2kState.epoch);
    const aNum = rMoon.changeOrigin(j2kState.position);
    const aDen = Math.pow(aNum.magnitude(), 3);
    const bNum = rMoon;
    const bDen = Math.pow(rMoon.magnitude(), 3);
    const grav = aNum.scale(1.0 / aDen).add(bNum.scale(-1.0 / bDen));
    return grav.scale(MoonBody.MU);
  }

  private sunGravity(j2kState: J2000) {
    const rSun = SunBody.position(j2kState.epoch);
    const aNum = rSun.changeOrigin(j2kState.position);
    const aDen = Math.pow(aNum.magnitude(), 3);
    const bNum = rSun;
    const bDen = Math.pow(rSun.magnitude(), 3);
    const grav = aNum.scale(1.0 / aDen).add(bNum.scale(-1.0 / bDen));
    return grav.scale(SunBody.MU);
  }

  public acceleration(j2kState: J2000, accMap: AccelerationMap) {
    if (this.moonGravityFlag) {
      accMap["moon_gravity"] = this.moonGravity(j2kState);
    }
    if (this.sunGravityFlag) {
      accMap["sun_gravity"] = this.sunGravity(j2kState);
    }
  }
}
