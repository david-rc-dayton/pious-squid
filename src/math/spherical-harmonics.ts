/** Class for handling spherical harmonics operations. */
export class SphericalHarmonics {
  /** dimension */
  private d: number;
  /** associated legendre polynomial table */
  private P: number[][];

  /**
   * Create a new SphericalHarmonics object.
   *
   * @param dimension degree
   */
  constructor(dimension: number) {
    this.d = dimension;
    this.P = [];
  }

  /**
   * Fetch the associated legendre polynomial from the provided index.
   *
   * @param l l-index
   * @param m m-index
   */
  public getP(l: number, m: number) {
    return this.P[l][m] || 0;
  }

  /** Reset the polynomial table to zeroes. */
  private clearTable() {
    this.P = [];
    for (let l = 0; l <= this.d; l++) {
      const temp = [];
      for (let m = 0; m <= l + 1; m++) {
        temp.push(0);
      }
      this.P.push(temp);
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
    P[0][0] = 1.0;
    P[0][1] = 0.0;
    P[1][0] = sPhi;
    P[1][1] = cPhi;
    for (let l = 2; l <= d; l++) {
      for (let m = 0; m <= l; m++) {
        if (l >= 2 && m == 0) {
          P[l][0] =
            ((2 * l - 1) * sPhi * this.getP(l - 1, 0) -
              (l - 1) * this.getP(l - 2, 0)) /
            l;
        } else if (m != 0 && m < l) {
          P[l][m] =
            this.getP(l - 2, m) + (2 * l - 1) * cPhi * this.getP(l - 1, m - 1);
        } else if (l == m && l != 0) {
          P[l][l] = (2 * l - 1) * cPhi * this.getP(l - 1, l - 1);
        }
      }
    }
  }
}
