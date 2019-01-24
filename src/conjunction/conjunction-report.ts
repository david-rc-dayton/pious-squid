import { Vector3D } from "../math/vector-3d";
import { Matrix3D } from "../math/matrix-3d";
import { MonteCarlo } from "../math/monte-carlo";

export class ConjunctionReport {
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
