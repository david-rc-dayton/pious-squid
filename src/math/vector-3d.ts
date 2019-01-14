import { Vector6D } from "./vector-6d";

/** Class representing a vector of length 3. */
export class Vector3D {
  /** Vector x-axis component. */
  public readonly x: number;
  /** Vector y-axis component. */
  public readonly y: number;
  /** Vector z-axis component. */
  public readonly z: number;

  /**
   * Create a new Vector3D object.
   *
   * @param x x-axis component
   * @param y y-axis component
   * @param z z-axis component
   */
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Create a new Vector3D object, containing zero for each state element.
   */
  public static origin(): Vector3D {
    return new Vector3D(0, 0, 0);
  }

  /** Return a string representation of this vector. */
  public toString(): string {
    const { x, y, z } = this;
    const xStr = x.toFixed(9);
    const yStr = y.toFixed(9);
    const zStr = z.toFixed(9);
    return `[ ${xStr}, ${yStr}, ${zStr} ]`;
  }

  /** Return the magnitude of this object. */
  public magnitude(): number {
    const { x, y, z } = this;
    return Math.sqrt(x * x + y * y + z * z);
  }

  /**
   * Calculate the Euclidean distance between this and another Vector3D.
   *
   * @param v the other vector
   */
  public distance(v: Vector3D): number {
    const { x, y, z } = this;
    var dx = x - v.x;
    var dy = y - v.y;
    var dz = z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Perform element-wise addition of this and another Vector.
   *
   * Returns a new Vector object containing the sum.
   *
   * @param v the other vector
   */
  public add(v: Vector3D): Vector3D {
    const { x, y, z } = this;
    return new Vector3D(x + v.x, y + v.y, z + v.z);
  }

  /**
   * Linearly scale the elements of this.
   *
   * Returns a new Vector object containing the scaled state.
   *
   * @param n scalar value
   */
  public scale(n: number): Vector3D {
    const { x, y, z } = this;
    return new Vector3D(x * n, y * n, z * n);
  }

  /** Return a new Vector3D object with all values negated. */
  public negate() {
    return this.scale(-1);
  }

  /**
   * Return the normalized (unit vector) form of this as a new Vector3D object.
   */
  public normalized(): Vector3D {
    const { x, y, z } = this;
    const m = this.magnitude();
    return new Vector3D(x / m, y / m, z / m);
  }

  /**
   * Calculate the cross product of this and another Vector.
   *
   * Returns the result as a new Vector object.
   *
   * @param v the other vector
   */
  public cross(v: Vector3D): Vector3D {
    const { x, y, z } = this;
    return new Vector3D(
      y * v.z - z * v.y,
      z * v.x - x * v.z,
      x * v.y - y * v.x
    );
  }

  /**
   * Calculate the dot product this and another Vector.
   *
   * @param v the other vector
   */
  public dot(v: Vector3D): number {
    const { x, y, z } = this;
    return x * v.x + y * v.y + z * v.z;
  }

  /**
   * Rotate the elements of this along the x-axis.
   *
   * @param theta rotation angle, in radians
   */
  public rot1(theta: number): Vector3D {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const { x, y, z } = this;
    return new Vector3D(
      1 * x + 0 * y + 0 * z,
      0 * x + cosT * y + sinT * z,
      0 * x + -sinT * y + cosT * z
    );
  }

  /**
   * Rotate the elements of this along the y-axis.
   *
   * @param theta rotation angle, in radians
   */
  public rot2(theta: number): Vector3D {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const { x, y, z } = this;
    return new Vector3D(
      cosT * x + 0 * y + -sinT * z,
      0 * x + 1 * y + 0 * z,
      sinT * x + 0 * y + cosT * z
    );
  }

  /**
   * Rotate the elements of this along the z-axis.
   *
   * @param theta rotation angle, in radians
   */
  public rot3(theta: number): Vector3D {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const { x, y, z } = this;
    return new Vector3D(
      cosT * x + sinT * y + 0 * z,
      -sinT * x + cosT * y + 0 * z,
      0 * x + 0 * y + 1 * z
    );
  }

  /**
   * Calculate the angle, in radians, between this and another Vector3D.
   *
   * @param v the other vector
   */
  public angle(v: Vector3D): number {
    var m = this.magnitude();
    return Math.acos(this.dot(v) / (m * m));
  }

  /**
   * Change coordinates of this to the relative position from a new origin.
   *
   * @param origin new origin
   */
  public changeOrigin(origin: Vector3D): Vector3D {
    const delta = origin.negate();
    return this.add(delta);
  }

  /**
   * Join this and another Vector3D object into a single Vector6D object.
   *
   * @param v other vector
   */
  public join(v: Vector3D) {
    const { x: a, y: b, z: c } = this;
    const { x, y, z } = v;
    return new Vector6D(a, b, c, x, y, z);
  }

  /**
   * Determine line of sight between two vectors and the radius of a central
   * object. Returns true if line-of-sight exists.
   *
   * @param v other vector
   * @param radius central body radius
   */
  public sight(v: Vector3D, radius: number) {
    const r1Mag2 = Math.pow(this.magnitude(), 2);
    const r2Mag2 = Math.pow(v.magnitude(), 2);
    const rDot = this.dot(v);
    let los = false;
    const tMin = (r1Mag2 - rDot) / (r1Mag2 + r2Mag2 - 2 * rDot);
    if (tMin < 0 || tMin > 1) {
      los = true;
    } else {
      const c = (1 - tMin) * r1Mag2 + rDot * tMin;
      if (c >= radius * radius) {
        los = true;
      }
    }
    return los;
  }
}
