export abstract class AbstractEpoch {
  /** Seconds since 1 January 1970, 00:00 UTC. */
  public readonly unix: number;

  /**
   * Create a new Epoch object.
   *
   * @param value milliseconds since 1 January 1970, 00:00 UTC, or Date string
   */
  constructor(value: string | number) {
    if (typeof value == "number") {
      this.unix = value / 1000;
    }
    if (typeof value === "string") {
      this.unix = new Date(value).getTime();
    } else {
      this.unix = 0;
    }
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
