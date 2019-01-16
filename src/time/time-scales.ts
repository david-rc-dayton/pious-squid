import { AbstractEpoch } from "./abstract-epoch";

/** UT1 Epoch */
export class EpochUT1 extends AbstractEpoch {
  constructor(millis: number) {
    super(millis);
  }
}

/** International Atomic Time (TAI) Epoch */
export class EpochTAI extends AbstractEpoch {
  constructor(millis: number) {
    super(millis);
  }
}

/** Terrestrial Time (TT) Epoch */
export class EpochTT extends AbstractEpoch {
  constructor(millis: number) {
    super(millis);
  }
}

/** Barycentric Dynamical Time (TDB) Epoch */
export class EpochTDB extends AbstractEpoch {
  constructor(millis: number) {
    super(millis);
  }
}
