export function factorial(n: number): number {
    let output = 1
    for (let i = n; i > 1; i--) {
        output *= i
    }
    return output
}

export function evalPoly(x: number, coeffs: number[]) {
    let output = 0
    for (let n = 0; n < coeffs.length; n++) {
        output += coeffs[n] * Math.pow(x, n)
    }
    return output
}

export function sign(n: number): number {
    if (n < 0) return -1
    if (n > 0) return 1
    return 0
}
