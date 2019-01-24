import { Vector3D } from "./vector-3d";

export type Matrix3DValues = [Vector3D, Vector3D, Vector3D];

export class Matrix3D {
  private readonly matrix: Matrix3DValues;

  constructor(a: Vector3D, b: Vector3D, c: Vector3D) {
    this.matrix = [a, b, c];
  }

  /** Return a string representation of this vector. */
  public toString(): string {
    const a0Str = this.get(0, 0).toFixed(9);
    const a1Str = this.get(0, 1).toFixed(9);
    const a2Str = this.get(0, 2).toFixed(9);
    const b0Str = this.get(1, 0).toFixed(9);
    const b1Str = this.get(1, 1).toFixed(9);
    const b2Str = this.get(1, 2).toFixed(9);
    const c0Str = this.get(2, 0).toFixed(9);
    const c1Str = this.get(2, 1).toFixed(9);
    const c2Str = this.get(2, 2).toFixed(9);
    return [
      `[ ${a0Str}, ${a1Str}, ${a2Str} ]`,
      `[ ${b0Str}, ${b1Str}, ${b2Str} ]`,
      `[ ${c0Str}, ${c1Str}, ${c2Str} ]`
    ].join("\n");
  }

  public get(row: number, column: number) {
    const rowVal = this.matrix[row];
    if (column === 0) {
      return rowVal.x;
    } else if (column === 1) {
      return rowVal.y;
    } else if (column === 2) {
      return rowVal.z;
    }
    return 0;
  }

  public transpose() {
    const a = new Vector3D(this.get(0, 0), this.get(1, 0), this.get(2, 0));
    const b = new Vector3D(this.get(0, 1), this.get(1, 1), this.get(2, 1));
    const c = new Vector3D(this.get(0, 2), this.get(1, 2), this.get(2, 2));
    return new Matrix3D(a, b, c);
  }

  public multiplyVector3D(v: Vector3D) {
    const { matrix } = this;
    return new Vector3D(matrix[0].dot(v), matrix[1].dot(v), matrix[2].dot(v));
  }

  public static zeroes() {
    return new Matrix3D(
      Vector3D.origin(),
      Vector3D.origin(),
      Vector3D.origin()
    );
  }
}
