import { Matrix3D } from "./matrix-3d";
import { Vector3D } from "./vector-3d";
import { RandomGaussian } from "./random-gaussian";

export class MonteCarlo {
  private readonly vector: Vector3D;
  private readonly covariance: Matrix3D;
  private readonly random: RandomGaussian;

  constructor(vector: Vector3D, covariance: Matrix3D, sigma: number) {
    this.vector = vector;
    this.covariance = covariance.scale(sigma).cholesky();
    this.random = new RandomGaussian(0, 1);
  }

  public sample() {
    const gauss = this.random.nextVector3D();
    const offset = this.covariance.multiplyVector3D(gauss);
    return this.vector.add(offset);
  }
}
