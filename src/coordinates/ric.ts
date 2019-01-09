import { Vector3D } from "../math/vector-3d";

export class RIC {
  public readonly relPosition: Vector3D;
  public readonly relVelocity: Vector3D;

  constructor(relPosition: Vector3D, relVelocity: Vector3D) {
    this.relPosition = relPosition;
    this.relVelocity = relVelocity;
  }
}
