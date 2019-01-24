import { Vector3D } from "./vector-3d";

export type Matrix3DValues = [Vector3D, Vector3D, Vector3D];

export class Matrix3D {
  private readonly matrix: Matrix3DValues;

  constructor(a: Vector3D, b: Vector3D, c: Vector3D) {
    this.matrix = [a, b, c];
  }

  public static zeroes() {
    return new Matrix3D(
      Vector3D.origin(),
      Vector3D.origin(),
      Vector3D.origin()
    );
  }

  /** Return a string representation of this vector. */
  public toString(): string {
    const a0Str = this.get(0, 0).toExponential(9);
    const a1Str = this.get(0, 1).toExponential(9);
    const a2Str = this.get(0, 2).toExponential(9);
    const b0Str = this.get(1, 0).toExponential(9);
    const b1Str = this.get(1, 1).toExponential(9);
    const b2Str = this.get(1, 2).toExponential(9);
    const c0Str = this.get(2, 0).toExponential(9);
    const c1Str = this.get(2, 1).toExponential(9);
    const c2Str = this.get(2, 2).toExponential(9);
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

  public scale(n: number) {
    return new Matrix3D(
      this.matrix[0].scale(n),
      this.matrix[1].scale(n),
      this.matrix[2].scale(n)
    );
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

  public cholesky() {
    const a = this;
    const l = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < i + 1; k++) {
        let sum = 0;
        for (let j = 0; j < k; j++) {
          sum += l[i][j] * l[k][j];
        }
        l[i][k] =
          i === k
            ? Math.sqrt(a.get(i, i) - sum)
            : (1 / l[k][k]) * (a.get(i, k) - sum);
      }
    }
    return new Matrix3D(
      new Vector3D(l[0][0], l[0][1], l[0][2]),
      new Vector3D(l[1][0], l[1][1], l[1][2]),
      new Vector3D(l[2][0], l[2][1], l[2][2])
    );
  }
}
