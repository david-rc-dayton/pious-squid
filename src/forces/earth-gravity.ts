import { EarthBody } from "../bodies/earth-body";
import { ITRF } from "../coordinates/itrf";
import { J2000 } from "../coordinates/j2000";
import { DataHandler } from "../data/data-handler";
import { SphericalHarmonics } from "../math/spherical-harmonics";
import { Vector3D } from "../math/vector-3d";
import { AccelerationForce, AccelerationMap } from "./forces-interface";

export class EarthGravity implements AccelerationForce {
  private earthAsphericalFlag: boolean;
  private degree: number;
  private order: number;
  private harmonics: SphericalHarmonics;

  constructor(degree: number, order: number) {
    this.earthAsphericalFlag = degree >= 2;
    this.degree = degree;
    this.order = order;
    this.harmonics = new SphericalHarmonics(degree);
  }

  private recurExp(
    m: number,
    lam: number,
    phi: number
  ): [number, number, number] {
    var smLam = Math.sin(m * lam);
    var cmLam = Math.cos(m * lam);
    var mtPhi = m * Math.tan(phi);
    return [smLam, cmLam, mtPhi];
  }

  private calcGradient(
    phi: number,
    lambda: number,
    r: number
  ): [number, number, number] {
    const { degree, order, harmonics, recurExp } = this;
    let sumR = 0;
    let sumPhi = 0;
    let sumLambda = 0;
    for (let l = 2; l <= degree; l++) {
      for (let m = 0; m <= Math.min(l, order); m++) {
        const { clm, slm } = DataHandler.getEgm96Coeffs(l, m);
        const [smLam, cmLam, mtPhi] = recurExp(m, lambda, phi);
        // r derivative
        const aR =
          Math.pow(EarthBody.RADIUS_EQUATOR / r, l) *
          (l + 1) *
          harmonics.getP(l, m);
        const bR = clm * cmLam + slm * smLam;
        sumR += aR * bR;
        // phi derivative
        const aPhi =
          Math.pow(EarthBody.RADIUS_EQUATOR / r, l) *
          (harmonics.getP(l, m + 1) - mtPhi * harmonics.getP(l, m));
        const bPhi = clm * cmLam + slm * smLam;
        sumPhi += aPhi * bPhi;
        // lambda derivative
        const aLambda =
          Math.pow(EarthBody.RADIUS_EQUATOR / r, l) * m * harmonics.getP(l, m);
        const bLambda = slm * cmLam - clm * smLam;
        sumLambda += aLambda * bLambda;
      }
    }
    const dR = -(EarthBody.MU / (r * r)) * sumR;
    const dPhi = (EarthBody.MU / r) * sumPhi;
    const dLambda = (EarthBody.MU / r) * sumLambda;
    return [dR, dPhi, dLambda];
  }

  private earthSpherical(j2kState: J2000) {
    const { position } = j2kState;
    const rMag = position.magnitude();
    return position.scale(-EarthBody.MU / (rMag * rMag * rMag));
  }

  private earthAspherical(j2kState: J2000) {
    const itrf = j2kState.toITRF();
    const pos = itrf.position;
    // const geo = itrf.toGeodetic();
    // const phi = geo.geocentricLatitude();
    // const lambda = geo.longitude;
    const p = Math.sqrt(pos.x ** 2 + pos.y ** 2);
    const phi = Math.atan2(pos.z, p);
    const lambda = Math.atan2(pos.y, pos.x);
    const r = pos.magnitude();
    this.harmonics.buildCache(phi);
    const [dR, dPhi, dLambda] = this.calcGradient(phi, lambda, r);
    const { x: ri, y: rj, z: rk } = pos;
    const r2 = r * r;
    const ri2 = ri * ri;
    const rj2 = rj * rj;
    const p1 = (1 / r) * dR - (rk / (r2 * Math.sqrt(ri2 + rj2))) * dPhi;
    const p2 = (1 / (ri2 + rj2)) * dLambda;
    const ai = p1 * ri - p2 * rj;
    const aj = p1 * rj + p2 * ri;
    const ak = (1 / r) * dR * rk + (Math.sqrt(ri2 + rj2) / r2) * dPhi;
    const accVec = new ITRF(j2kState.epoch, new Vector3D(ai, aj, ak));
    return accVec.toJ2000().position;
  }

  public acceleration(j2kState: J2000, accMap: AccelerationMap) {
    accMap["earth_gravity_spherical"] = this.earthSpherical(j2kState);
    if (this.earthAsphericalFlag) {
      accMap["earth_gravity_aspherical"] = this.earthAspherical(j2kState);
    }
  }
}
