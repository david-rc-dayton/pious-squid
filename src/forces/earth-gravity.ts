import { EarthBody } from "../bodies/earth-body";
import { ITRF } from "../coordinates/itrf";
import { J2000 } from "../coordinates/j2000";
import { DataHandler } from "../data/data-handler";
import { SphericalHarmonics } from "../math/spherical-harmonics";
import { Vector3D } from "../math/vector-3d";
import { AccelerationForce, AccelerationMap } from "./forces-interface";

/** Model of Earth gravity, for use in a ForceModel object. */
export class EarthGravity implements AccelerationForce {
  /** model aspherical gravity, if true. */
  private earthAsphericalFlag: boolean;
  /** geopotential degree (max=70) */
  private degree: number;
  /** geopotential order (max=70) */
  private order: number;
  /** spherical harmonics manager */
  private harmonics: SphericalHarmonics;

  /**
   * Create a new EarthGravity object.
   *
   * @param degree geopotential degree (max=70)
   * @param order geopotential order (max=70)
   */
  constructor(degree: number, order: number) {
    this.earthAsphericalFlag = degree >= 2;
    this.degree = degree;
    this.order = order;
    this.harmonics = new SphericalHarmonics(degree);
  }

  /**
   * Calculate a cache of recurring values for the geopotential model:
   *
   *     [
   *       sin(m * lambda),
   *       cos(m * lambda),
   *       tan(phi)
   *     ]
   *
   * @param m m-index
   * @param lambda longitude, in radians
   * @param phi geocentric latitude, in radians
   */
  private recurExp(
    m: number,
    lambda: number,
    phi: number
  ): [number, number, number] {
    var smLam = Math.sin(m * lambda);
    var cmLam = Math.cos(m * lambda);
    var mtPhi = m * Math.tan(phi);
    return [smLam, cmLam, mtPhi];
  }

  /**
   * Calculate R, Phi, and Lambda acceleration derivatives.
   *
   * @param phi geocentric latitude, in radians
   * @param lambda longitude, in radians
   * @param r radius (km)
   */
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

  /**
   * Calculate acceleration due to Earth's gravity, assuming a spherical Earth.
   *
   * @param j2kState J2000 state vector
   */
  private earthSpherical(j2kState: J2000) {
    const { position } = j2kState;
    const rMag = position.magnitude();
    return position.scale(-EarthBody.MU / (rMag * rMag * rMag));
  }

  /**
   * Calculate the aspherical components of acceleration due to Earth's gravity.
   *
   * @param j2kState J2000 state vector
   */
  private earthAspherical(j2kState: J2000) {
    const itrf = j2kState.toITRF();
    const { x: ri, y: rj, z: rk } = itrf.position;
    const p = Math.sqrt(ri * ri + rj * rj);
    const phi = Math.atan2(rk, p);
    const lambda = Math.atan2(rj, ri);
    const r = itrf.position.magnitude();
    this.harmonics.buildCache(phi);
    const [dR, dPhi, dLambda] = this.calcGradient(phi, lambda, r);
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

  /**
   * Update the acceleration map argument with a calculated "earth_gravity"
   * value, for the provided state vector.
   *
   * @param j2kState J2000 state vector
   * @param accMap acceleration map (km/s^2)
   */
  public acceleration(j2kState: J2000, accMap: AccelerationMap) {
    accMap["earth_gravity"] = this.earthSpherical(j2kState);
    if (this.earthAsphericalFlag) {
      accMap["earth_gravity"] = accMap["earth_gravity"].add(
        this.earthAspherical(j2kState)
      );
    }
  }
}
