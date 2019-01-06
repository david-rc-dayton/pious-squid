export class SphericalHarmonics {
  private d: number;
  private P: number[][];

  constructor(dimension: number) {
    this.d = dimension;
    this.P = [];
  }

  public getP(l: number, m: number) {
    return this.P[l][m] || 0;
  }

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

  public buildCache(phi: number) {
    this.clearTable();
    const { d, P, getP } = this;
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
            ((2 * l - 1) * sPhi * getP(l - 1, 0) - (l - 1) * getP(l - 2, 0)) /
            l;
        } else if (m != 0 && m < l) {
          P[l][m] = getP(l - 2, m) + (2 * l - 1) * cPhi * getP(l - 1, m - 1);
        } else if (l == m && l != 0) {
          P[l][l] = (2 * l - 1) * cPhi * getP(l - 1, l - 1);
        }
      }
    }
  }
}
