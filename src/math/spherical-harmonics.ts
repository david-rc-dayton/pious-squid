/** Class for handling spherical harmonics operations. */
export class SphericalHarmonics {
  /** dimension */
  private d: number;
  /** associated legendre polynomial table */
  private P: number[];

  /**
   * Create a new SphericalHarmonics object.
   *
   * @param dimension degree
   */
  constructor(dimension: number) {
    this.d = dimension;
    this.P = [];
  }

  private index(l: number, m: number) {
    return (l * l + l) / 2 + m;
  }

  /**
   * Fetch the associated legendre polynomial from the provided index.
   *
   * @param l l-index
   * @param m m-index
   */
  public getP(l: number, m: number) {
    if (m > l) {
      return 0;
    }
    return this.P[this.index(l, m)] || 0;
  }

  /** Reset the polynomial table to zeroes. */
  private clearTable() {
    this.P = [];
    for (let i = 0; i <= this.index(this.d, this.d); i++) {
      this.P.push(0);
    }
  }

  /**
   * Build a cache of associated Legendre polynomials.
   *
   * @param phi geocentric latitude
   */
  public buildCache(phi: number) {
    this.clearTable();
    const { d, P } = this;
    const sPhi = Math.sin(phi);
    const cPhi = Math.cos(phi);
    P[this.index(0, 0)] = 1;
    P[this.index(1, 0)] = sPhi;
    P[this.index(1, 1)] = cPhi;
    for (let l = 2; l <= d; l++) {
      for (let m = 0; m <= l; m++) {
        if (l >= 2 && m == 0) {
          P[this.index(l, 0)] =
            ((2 * l - 1) * sPhi * this.getP(l - 1, 0) -
              (l - 1) * this.getP(l - 2, 0)) /
            l;
        } else if (m != 0 && m < l) {
          P[this.index(l, m)] =
            this.getP(l - 2, m) + (2 * l - 1) * cPhi * this.getP(l - 1, m - 1);
        } else if (l == m && l != 0) {
          P[this.index(l, l)] = (2 * l - 1) * cPhi * this.getP(l - 1, l - 1);
        }
      }
    }
  }
}
