import { TWO_PI } from "./constants";

/**
 * Calculate the factorial of a number.
 *
 * Throws an error if argument is not a positive integer.
 *
 * @param n a positive integer
 */
export function factorial(n: number): number {
  n = Math.abs(n);
  let output = 1;
  for (let i = 0; i < n; i++) {
    output *= i + 1;
  }
  return output;
}

/**
 * Evaluate a polynomial given a variable and its coefficients. Exponents are
 * implied to start at zero.
 *
 * @param x variable
 * @param coeffs coefficients, from lowest to highest
 */
export function evalPoly(x: number, coeffs: number[]): number {
  let output = 0;
  for (let n = 0; n < coeffs.length; n++) {
    output += coeffs[n] * x ** n;
  }
  return output;
}

/**
 * Return the sign of the number, 1 if positive, -1 if negative, 0 if zero.
 *
 * @param n a number
 */
export function sign(n: number): number {
  if (n < 0) {
    return -1;
  }
  if (n > 0) {
    return 1;
  }
  return 0;
}

/**
 * Return the angle (original or inverse) that exists in the half plane of the
 * match argument.
 *
 * @param angle angle to (possibly) adjust
 * @param match reference angle
 */
export function matchHalfPlane(angle: number, match: number): number {
  const [a1, a2] = [angle, TWO_PI - angle];
  const d1 = Math.atan2(Math.sin(a1 - match), Math.cos(a1 - match));
  const d2 = Math.atan2(Math.sin(a2 - match), Math.cos(a2 - match));
  return Math.abs(d1) < Math.abs(d2) ? a1 : a2;
}

/**
 * Linearly interpolate between two known points.
 *
 * @param x value to interpolate
 * @param x0 start x-value
 * @param y0 start y-value
 * @param x1 end x-value
 * @param y1 end y-value
 */
export function linearInterpolate(
  x: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
): number {
  return (y0 * (x1 - x) + y1 * (x - x0)) / (x1 - x0);
}

/**
 * Copy the sign of one number, to the magnitude of another.
 *
 * @param magnitude
 * @param sign
 */
export function copySign(magnitude: number, sign: number) {
  const m = Math.abs(magnitude);
  const s = sign >= 0 ? 1 : -1;
  return s * m;
}

/**
 * Calculate the mean of the input array.
 *
 * @param values an array of numbers
 */
export function mean(values: number[]) {
  const n = values.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += values[i];
  }
  return sum / n;
}

export function standardDeviation(values: number[]) {
  const mu = mean(values);
  const n = values.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const sub = values[i] - mu;
    sum += sub * sub;
  }
  return Math.sqrt((1 / n) * sum);
}

export function median(values: number[]) {
  const tArray = values.concat().sort();
  return tArray[Math.floor(tArray.length / 2)];
}
