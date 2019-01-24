import { TWO_PI } from "./constants";
import { Vector3D } from "./vector-3d";

/**
 * Class for generating random Gaussian numbers.
 *
 * Uses the Box-Mueller Transform for generating gaussian numbers from uniformly
 * distributed numbers.
 */
export class RandomGaussian {
  /** mean value */
  private mu: number;
  /** standard deviation */
  private sigma: number;
  /** gaussian storage 0 */
  private z0: number;
  /** gaussian storage 1 */
  private z1: number;
  /** uniform storage 1 */
  private u1: number;
  /** uniform storage 2 */
  private u2: number;
  /** should generate new values if true */
  private generate: boolean;

  /**
   * Create a RandomGaussian object.
   *
   * @param mu mean value
   * @param sigma standard deviation
   */
  constructor(mu: number, sigma: number) {
    this.mu = mu;
    this.sigma = sigma;
    this.z0 = 0;
    this.z1 = 0;
    this.u1 = 0;
    this.u2 = 0;
    this.generate = true;
  }

  /** Return the next random Gaussian number. */
  public next() {
    if (!this.generate) {
      return this.z1 * this.sigma + this.mu;
    }

    do {
      this.u1 = Math.random();
      this.u2 = Math.random();
    } while (this.u1 <= Number.MIN_VALUE);

    const prefix = Math.sqrt(-2.0 * Math.log(this.u1));
    this.z0 = prefix * Math.cos(TWO_PI * this.u2);
    this.z1 = prefix * Math.sin(TWO_PI * this.u2);
    return this.z0 * this.sigma + this.mu;
  }

  /** Return the next random Gaussian Vector3D object. */
  public nextVector3D() {
    return new Vector3D(this.next(), this.next(), this.next());
  }
}
