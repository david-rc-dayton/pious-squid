import { Vector3D } from "./vector-3d";

export class Vector6D {
  public readonly a: number;
  public readonly b: number;
  public readonly c: number;
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

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

  public static origin(): Vector6D {
    return new Vector6D(0, 0, 0, 0, 0, 0);
  }

  public add(v: Vector6D): Vector6D {
    const { a, b, c, x, y, z } = this;
    return new Vector6D(a + v.a, b + v.b, c + v.c, x + v.x, y + v.y, z + v.z);
  }

  public scale(n: number): Vector6D {
    const { a, b, c, x, y, z } = this;
    return new Vector6D(a * n, b * n, c * n, x * n, y * n, z * n);
  }

  public split(): [Vector3D, Vector3D] {
    const { a, b, c, x, y, z } = this;
    return [new Vector3D(a, b, c), new Vector3D(x, y, z)];
  }
}
