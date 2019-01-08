import { EarthBody } from "../bodies/earth-body";
import { J2000 } from "../coordinates/j2000";
import { DataHandler } from "../data/data-handler";
import { AccelerationForce, AccelerationMap } from "./forces-interface";

export class AtmosphericDrag implements AccelerationForce {
  private mass: number;
  private area: number;
  private dragCoeff: number;

  constructor(mass: number, area: number, dragCoeff: number) {
    this.mass = mass;
    this.area = area;
    this.dragCoeff = dragCoeff;
  }

  public expAtmosphereDrag(j2kState: J2000) {
    const { position, velocity } = j2kState;
    const { mass, area, dragCoeff } = this;
    var density = DataHandler.getExpAtmosphericDensity(position);
    var vRel = velocity
      .add(EarthBody.ROTATION.negate().cross(position))
      .scale(1000);
    var fScale =
      -0.5 *
      density *
      ((dragCoeff * area) / mass) *
      Math.pow(vRel.magnitude(), 2);
    return vRel.normalized().scale(fScale / 1000);
  }

  public acceleration(j2kState: J2000, accMap: AccelerationMap) {
    accMap["atmospheric_drag"] = this.expAtmosphereDrag(j2kState);
  }
}
