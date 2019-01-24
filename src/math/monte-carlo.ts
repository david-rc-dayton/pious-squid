import { Matrix3D } from "./matrix-3d";
import { Vector3D } from "./vector-3d";
import { RandomGaussian } from "./random-gaussian";

/** Class for performing Monte-Carlo simulations. */
export class MonteCarlo {
  /** simulation vector */
  private readonly vector: Vector3D;
  /** simulation covariance */
  private readonly covariance: Matrix3D;
  /** random gaussian generator */
  private readonly random: RandomGaussian;

  /**
   * Create a new MonteCarlo object.
   *
   * @param vector simulation vector
   * @param covariance simulation covariance
   * @param sigma standard deviation
   */
  constructor(vector: Vector3D, covariance: Matrix3D, sigma: number) {
    this.vector = vector;
    this.covariance = covariance.scale(sigma).cholesky();
    this.random = new RandomGaussian(0, 1);
  }

  /**
   * Sample the simulation space, and return a new statistically
   * relevent vector.
   */
  public sample() {
    const gauss = this.random.nextVector3D();
    const offset = this.covariance.multiplyVector3D(gauss);
    return this.vector.add(offset);
  }
}
