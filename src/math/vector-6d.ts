import { Vector3D } from "./vector-3d";

/** Class representing a vector of length 6. */
export class Vector6D {
  /** Vector a-axis component. */
  public readonly a: number;
  /** Vector b-axis component. */
  public readonly b: number;
  /** Vector c-axis component. */
  public readonly c: number;
  /** Vector x-axis component. */
  public readonly x: number;
  /** Vector y-axis component. */
  public readonly y: number;
  /** Vector z-axis component. */
  public readonly z: number;

  /**
   * Create a new Vector6D object.
   *
   * @param a a-axis component
   * @param b b-axis component
   * @param c c-axis component
   * @param x x-axis component
   * @param y y-axis component
   * @param z z-axis component
   */
  constructor(
    a: number,
    b: number,
    c: number,
    x: number,
    y: number,
    z: number
  ) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Create a new Vector6D object, containing zero for each state element.
   */
  public static origin(): Vector6D {
    return new Vector6D(0, 0, 0, 0, 0, 0);
  }

  /**
   * Perform element-wise addition of this and another Vector.
   *
   * Returns a new Vector object containing the sum.
   *
   * @param v the other vector
   */
  public add(v: Vector6D): Vector6D {
    const { a, b, c, x, y, z } = this;
    return new Vector6D(a + v.a, b + v.b, c + v.c, x + v.x, y + v.y, z + v.z);
  }

  /**
   * Linearly scale the elements of this.
   *
   * Returns a new Vector object containing the scaled state.
   *
   * @param n scalar value
   */
  public scale(n: number): Vector6D {
    const { a, b, c, x, y, z } = this;
    return new Vector6D(a * n, b * n, c * n, x * n, y * n, z * n);
  }

  /** Split this into two Vector3D objects. */
  public split(): [Vector3D, Vector3D] {
    const { a, b, c, x, y, z } = this;
    return [new Vector3D(a, b, c), new Vector3D(x, y, z)];
  }
}
