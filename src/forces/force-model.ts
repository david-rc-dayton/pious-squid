import { EarthGravity } from "./earth-gravity";
import { ThirdBody } from "./third-body";
import { AtmosphericDrag } from "./atmospheric-drag";
import { SolarRadiationPressure } from "./solar-radiation-pressure";
import { J2000 } from "../coordinates/j2000";
import { AccelerationMap } from "./forces-interface";
import { Vector3D } from "../math/vector-3d";
import { Vector6D } from "../math/vector-6d";

/** Object for efficiently managing acceleration forces on a spacecraft. */
export class ForceModel {
  /** Earth gravity model, if applicable */
  private earthGravity: EarthGravity | null;
  /** third-body model, if applicable */
  private thirdBody: ThirdBody | null;
  /** atmospheric drag model, if applicable */
  private atmosphericDrag: AtmosphericDrag | null;
  /** solar radiation pressure model, if applicable */
  private solarRadiationPressure: SolarRadiationPressure | null;

  /** Create a new ForceModel object. */
  constructor() {
    this.earthGravity = null;
    this.thirdBody = null;
    this.atmosphericDrag = null;
    this.solarRadiationPressure = null;
  }

  /** Clear all current AccelerationForce models for this object. */
  public clearModel() {
    this.earthGravity = null;
    this.thirdBody = null;
    this.atmosphericDrag = null;
    this.solarRadiationPressure = null;
  }

  /**
   * Create and add a new EarthGravity force to this object.
   *
   * @param degree geopotential degree (max=70)
   * @param order geopotential order (max=70)
   */
  public setEarthGravity(degree: number, order: number) {
    this.earthGravity = new EarthGravity(degree, order);
  }

  /**
   * Create and add a new ThirdBody force to this object.
   *
   * @param moon moon gravity, if true
   * @param sun sun gravity, if true
   */
  public setThirdBody(moon: boolean, sun: boolean) {
    this.thirdBody = new ThirdBody(moon, sun);
  }

  /**
   * Create and add a new AtmosphericDrag force to this object.
   *
   * @param mass spacecraft mass, in kilograms
   * @param area spacecraft area, in square meters
   * @param dragCoeff drag coefficient (default=2.2)
   */
  public setAtmosphericDrag(mass: number, area: number, dragCoeff = 2.2) {
    this.atmosphericDrag = new AtmosphericDrag(mass, area, dragCoeff);
  }

  /**
   * Create and add a new SolarRadiationPressure force to this object.
   *
   * @param mass spacecraft mass, in kilograms
   * @param area spacecraft area, in square meters
   * @param reflectCoeff reflectivity coefficient (default=1.2)
   */
  public setSolarRadiationPressure(
    mass: number,
    area: number,
    reflectCoeff = 1.2
  ) {
    this.solarRadiationPressure = new SolarRadiationPressure(
      mass,
      area,
      reflectCoeff
    );
  }

  /**
   * Create an acceleration map argument with calculated values for each
   * acceleration source, for the provided state vector.
   *
   * @param j2kState J2000 state vector
   */
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

  /**
   * Calculate and return the 6-dimensional derivative (velocity, acceleration)
   * for the provided state vector.
   *
   * @param j2kState J2000 state vector
   */
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
