import { Vector3D } from "../math/vector-3d";
import { Matrix3D } from "../math/matrix-3d";
import { MonteCarlo } from "../math/monte-carlo";

/** Class for satellite conjunction operations. */
export class ConjunctionReport {
  /**
   * Simulate possible outcomes of a satellite conjunction, using information
   * found in a Conjunction Summary Message (CSM).
   *
   * @param posA asset position
   * @param covA asset covariance
   * @param posB satellite position
   * @param covB satellite covariance
   * @param sigma standard deviation
   * @param iterations number of samples
   */
  public static simulateConjunction(
    posA: Vector3D,
    covA: Matrix3D,
    posB: Vector3D,
    covB: Matrix3D,
    sigma: number,
    iterations: number
  ) {
    const mcA = new MonteCarlo(posA, covA, sigma);
    const mcB = new MonteCarlo(posB, covB, sigma);
    const missDistances: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const sampleA = mcA.sample();
      const sampleB = mcB.sample();
      missDistances.push(sampleA.distance(sampleB));
    }
    return missDistances;
  }
}
