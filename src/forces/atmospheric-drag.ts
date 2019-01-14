import { EarthBody } from "../bodies/earth-body";
import { J2000 } from "../coordinates/j2000";
import { DataHandler } from "../data/data-handler";
import { AccelerationForce, AccelerationMap } from "./forces-interface";

/** Model of atmospheric drag, for use in a ForceModel object. */
export class AtmosphericDrag implements AccelerationForce {
  /** spacecraft mass, in kilograms */
  private mass: number;
  /** spacecraft area, in square meters */
  private area: number;
  /** drag coefficient (unitless) */
  private dragCoeff: number;

  /**
   * Create a new atmospheric drag AccelerationForce object.
   *
   * @param mass spacecraft mass, in kilograms
   * @param area spacecraft area, in square meters
   * @param dragCoeff drag coefficient (unitless)
   */
  constructor(mass: number, area: number, dragCoeff: number) {
    this.mass = mass;
    this.area = area;
    this.dragCoeff = dragCoeff;
  }

  /**
   * Calculate acceleration due to atmospheric drag, using the Exponential
   * Atmospheric Density model.
   *
   * @param j2kState J2000 state vector
   */
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

  /**
   * Update the acceleration map argument with a calculated "atmospheric_drag"
   * value, for the provided state vector.
   *
   * @param j2kState J2000 state vector
   * @param accMap acceleration map (km/s^2)
   */
  public acceleration(j2kState: J2000, accMap: AccelerationMap) {
    accMap["atmospheric_drag"] = this.expAtmosphereDrag(j2kState);
  }
}
