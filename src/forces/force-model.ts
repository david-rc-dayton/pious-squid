import { EarthGravity } from "./earth-gravity";
import { ThirdBody } from "./third-body";
import { AtmosphericDrag } from "./atmospheric-drag";
import { SolarRadiationPressure } from "./solar-radiation-pressure";
import { J2000 } from "../coordinates/j2000";
import { AccelerationMap } from "./forces-interface";
import { Vector3D } from "../math/vector-3d";
import { Vector6D } from "../math/vector-6d";

export class ForceModel {
  private earthGravity: EarthGravity | null;
  private thirdBody: ThirdBody | null;
  private atmosphericDrag: AtmosphericDrag | null;
  private solarRadiationPressure: SolarRadiationPressure | null;

  constructor() {
    this.earthGravity = null;
    this.thirdBody = null;
    this.atmosphericDrag = null;
    this.solarRadiationPressure = null;
  }

  public clearModel() {
    this.earthGravity = null;
    this.thirdBody = null;
    this.atmosphericDrag = null;
    this.solarRadiationPressure = null;
  }

  public setEarthGravity(degree: number, order: number) {
    this.earthGravity = new EarthGravity(degree, order);
  }

  public setThirdBody(moon: boolean, sun: boolean) {
    this.thirdBody = new ThirdBody(moon, sun);
  }

  public setAtmosphericDrag(mass: number, area: number, dragCoeff: number) {
    this.atmosphericDrag = new AtmosphericDrag(mass, area, dragCoeff);
  }

  public setSolarRadiationPressure(
    mass: number,
    area: number,
    reflectCoeff: number
  ) {
    this.solarRadiationPressure = new SolarRadiationPressure(
      mass,
      area,
      reflectCoeff
    );
  }

  public accelerations(j2kState: J2000) {
    const accMap: AccelerationMap = {};
    if (this.earthGravity !== null) {
      this.earthGravity.acceleration(j2kState, accMap);
    }
    if (this.thirdBody !== null) {
      this.thirdBody.acceleration(j2kState, accMap);
    }
    if (this.atmosphericDrag !== null) {
      this.atmosphericDrag.acceleration(j2kState, accMap);
    }
    if (this.solarRadiationPressure !== null) {
      this.solarRadiationPressure.acceleration(j2kState, accMap);
    }
    return accMap;
  }

  public derivative(j2kState: J2000) {
    const accMap = this.accelerations(j2kState);
    let accel = Vector3D.origin();
    for (let k in accMap) {
      accel = accel.add(accMap[k]);
    }
    const { x: vx, y: vy, z: vz } = j2kState.velocity;
    const { x: ax, y: ay, z: az } = accel;
    return new Vector6D(vx, vy, vz, ax, ay, az);
  }
}
