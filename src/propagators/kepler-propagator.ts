import { ClassicalElements } from "../coordinates/classical-elements";
import { J2000 } from "../coordinates/j2000";
import { TWO_PI } from "../math/constants";
import { matchHalfPlane } from "../math/operations";
import { EpochUTC } from "../time/epoch-utc";
import { IPropagator } from "./propagator-interface";

/** Satellite ephemeris propagator, using Kepler's method. */
export class KeplerPropagator implements IPropagator {
  /** Cache for last computed statellite state. */
  public state: J2000;
  /** Keplerian element set. */
  private readonly elements: ClassicalElements;

  /**
   * Create a new Kepler propagator object. This propagator only models
   * two-body effects on the orbiting object.
   *
   * @param elements Keplerian element set
   */
  constructor(elements: ClassicalElements) {
    this.elements = elements;
    this.state = elements.toJ2000();
  }

  /** Return a string representation of the object. */
  public toString() {
    return ["[Kepler]", "  Two-Body Propagator"].join("\n");
  }

  /**
   * Restore cached state to initial propagator state. Doesn't really do much
   * for the Kepler propagator, since it doesn't rely on transient states.
   */
  public reset(): KeplerPropagator {
    this.state = this.elements.toJ2000();
    return this;
  }

  /**
   * Propagate satellite state to a new epoch.
   *
   * @param epoch UTC epoch
   */
  public propagate(epoch: EpochUTC): J2000 {
    const { epoch: t, a, e, i, o, w, v } = this.elements;
    const delta = epoch.difference(t);
    const n = this.elements.meanMotion();
    let eaInit = Math.acos((e + Math.cos(v)) / (1 + e * Math.cos(v)));
    eaInit = matchHalfPlane(eaInit, v);
    let maInit = eaInit - e * Math.sin(eaInit);
    maInit = matchHalfPlane(maInit, eaInit);
    const maFinal = (maInit + n * delta) % TWO_PI;
    let eaFinal = maFinal;
    for (let iter = 0; iter < 32; iter++) {
      const eaTemp = maFinal + e * Math.sin(eaFinal);
      if (Math.abs(eaTemp - eaFinal) < 1e-12) {
        break;
      }
      eaFinal = eaTemp;
    }
    let vFinal = Math.acos(
      (Math.cos(eaFinal) - e) / (1 - e * Math.cos(eaFinal))
    );
    vFinal = matchHalfPlane(vFinal, eaFinal);
    this.state = new ClassicalElements(epoch, a, e, i, o, w, vFinal).toJ2000();
    return this.state;
  }

  /**
   * Propagate state by some number of seconds, repeatedly, starting at a
   * specified epoch.
   *
   * @param epoch UTC epoch
   * @param interval seconds between output states
   * @param count number of steps to take
   */
  public step(epoch: EpochUTC, interval: number, count: number): J2000[] {
    const output: J2000[] = [this.propagate(epoch)];
    let tempEpoch = epoch;
    for (let i = 0; i < count; i++) {
      tempEpoch = tempEpoch.roll(interval);
      output.push(this.propagate(tempEpoch));
    }
    return output;
  }
}
