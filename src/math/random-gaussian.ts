import { TWO_PI } from "./constants";
import { Vector3D } from "./vector-3d";

export class RandomGaussian {
  private mu: number;
  private sigma: number;
  private z0: number;
  private z1: number;
  private u1: number;
  private u2: number;
  private generate: boolean;

  constructor(mu: number, sigma: number) {
    this.mu = mu;
    this.sigma = sigma;
    this.z0 = 0;
    this.z1 = 0;
    this.u1 = 0;
    this.u2 = 0;
    this.generate = true;
  }

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

  public nextVector3D() {
    return new Vector3D(this.next(), this.next(), this.next());
  }
}
