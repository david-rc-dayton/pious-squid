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

  public difference(epoch: AbstractEpoch) {
    return this.unix - epoch.unix;
  }

  public equals(epoch: AbstractEpoch) {
    return this.unix == epoch.unix;
  }

  public toDate() {
    return new Date(this.unix * 1000);
  }

  public toString() {
    return this.toDate().toISOString();
  }

  public toJulianDate() {
    return this.unix / 86400 + 2440587.5;
  }

  public toJulianCenturies() {
    return (this.toJulianDate() - 2451545) / 36525;
  }
}
