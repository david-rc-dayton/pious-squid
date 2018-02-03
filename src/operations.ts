/**
 * Calculate the factorial of a number.
 * @param n a positive integer
 */
export function factorial(n: number): number {
    let output = 1;
    for (let i = n; i > 1; i--) {
        output *= i;
    }
    return output;
}

/**
 * Evaluate a polynomial.
 * @param x variable
 * @param coeffs coefficients, from lowest to highest starting at exponent zero
 */
export function evalPoly(x: number, coeffs: number[]) {
    let output = 0;
    for (let n = 0; n < coeffs.length; n++) {
        output += coeffs[n] * Math.pow(x, n);
    }
    return output;
}

/**
 * Return the sign of the number, 1 if positive, -1 if negative, 0 if zero.
 * @param n a number
 */
export function sign(n: number): number {
    if (n < 0) { return -1; }
    if (n > 0) { return 1; }
    return 0;
}
