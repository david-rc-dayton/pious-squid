import { J2000 } from "../coordinates/j2000";
import { EpochUTC } from "../time/epoch-utc";

/** Common interface for propagator objects. */
export interface IPropagator {
  /** Cache for last computed statellite state. */
  state: J2000;
  /** Propagate state to a new epoch. */
  propagate(epoch: EpochUTC): J2000;
  /** Propagate state by some number of seconds, repeatedly. */
  step(epoch: EpochUTC, interval: number, count: number): J2000[];
  /** Restore initial propagator state. */
  reset(): void;
}
