/** Base class for representing epochs. */
export abstract class AbstractEpoch {
  /** Seconds since 1 January 1970, 00:00 UTC. */
  public readonly unix: number;

  /**
   * Create a new Epoch object.
   *
   * @param millis milliseconds since 1 January 1970, 00:00 UTC
   */
  constructor(millis: number) {
    this.unix = millis / 1000;
  }

  /**
   * Calculate the difference between this and another epoch, in seconds.
   *
   * @param epoch comparison epoch
   */
  public difference(epoch: AbstractEpoch) {
    return this.unix - epoch.unix;
  }

  /**
   * Return true if this and another epoch are equal.
   *
   * @param epoch comparison epoch
   */
  public equals(epoch: AbstractEpoch) {
    return this.unix == epoch.unix;
  }

  /** Convert this to a JavaScript Date object. */
  public toDate() {
    return new Date(this.unix * 1000);
  }

  /** String representation of this object. */
  public toString() {
    return this.toDate().toISOString();
  }

  /** Convert this to a Julian Date. */
  public toJulianDate() {
    return this.unix / 86400 + 2440587.5;
  }

  /** Convert this to Julian Centuries. */
  public toJulianCenturies() {
    return (this.toJulianDate() - 2451545) / 36525;
  }
}
