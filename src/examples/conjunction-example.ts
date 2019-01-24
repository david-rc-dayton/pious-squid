import { ConjunctionReport, Matrix3D, Vector3D } from "../index";

// =============================================================================
// simulate conjunction using Conjunction Summary Message (CSM) data
// example data from: https://www.space-track.org/documents/CSM_Guide.pdf
// =============================================================================

// load relative position and covariance from the report
const posA = new Vector3D(27.4, -70.2, 711.8); // meters
const covA = new Matrix3D( // asset covariance (meters)
  new Vector3D(4.142e1, -8.579, -2.312e1),
  new Vector3D(-8.579, 2.533e3, 1.336e1),
  new Vector3D(-2.312e1, 1.336e1, 7.098e1)
);

const posB = Vector3D.origin(); // zero since relative position is used
const covB = new Matrix3D( // satellite covariance (meters)
  new Vector3D(1.337e3, -4.806e4, -3.298e1),
  new Vector3D(-4.806e4, 2.492e6, -7.588e2),
  new Vector3D(-3.298e1, -7.588e2, 7.105e1)
);

// run a monte-carlo simulation of the conjunction and generate miss-distances
const missDists = ConjunctionReport.simulateConjunction(
  posA, // asset position
  covA, // asset covariance
  posB, // satellite position
  covB, // satellite covariance
  3, // standard deviation (sigma)
  1000000 // iterations (some big number)
);

// =============================================================================
// NOTE: results may vary due to the random nature of monte-carlo simulation
// =============================================================================

console.log(`Expected Miss-Distance: ${posA.distance(posB).toFixed(3)} meters`);
// => Expected Miss-Distance: 715.778 meters

console.log(
  `Smallest Simulated Miss-Distance: ${missDists
    .reduce((a, b) => (a < b ? a : b))
    .toFixed(3)} meters`
);
// => Smallest Simulated Miss-Distance: 633.235 meters

console.log(
  `Largest Simulated Miss-Distance: ${missDists
    .reduce((a, b) => (a > b ? a : b))
    .toFixed(3)} meters`
);
// => Largest Simulated Miss-Distance: 13121.900 meters

// generate a histogram of the miss distances (for illustrative purposes)
console.log("\n----- Miss-Distance Probability -----");
const step = 250;
for (let m = 0; m <= 2500; m += step) {
  const count = missDists.filter(dist => dist >= m && dist < m + step).length;
  const percent = (count / missDists.length) * 100;
  const hist: string[] = ["|"];
  for (let i = 0; i < percent; i++) {
    hist.push("*");
  }
  const rangeStr = (m.toLocaleString() + "m:      ").substr(0, 7);
  const percentStr = (percent.toFixed(1) + "%   ").substr(0, 5);
  console.log(`  ${rangeStr}  ${percentStr}  ${hist.join("")}`);
}
// =>
// ----- Miss-Distance Probability -----
//   0m:      0.0%   |
//   250m:    0.0%   |
//   500m:    6.4%   |*******
//   750m:    13.8%  |**************
//   1,000m:  9.0%   |*********
//   1,250m:  7.8%   |********
//   1,500m:  7.0%   |********
//   1,750m:  6.4%   |*******
//   2,000m:  5.9%   |******
//   2,250m:  5.5%   |******
//   2,500m:  5.0%   |*****
