/**
 * Calculate the density of the Earth's atmosphere, in kg/m^3, for a given
 * position using the exponential atmospheric density model.
 *
 * @param position satellite position 3-vector, in kilometers
 */
export function atmosphericDensity(position: Vector): number {
    const rDist = position.magnitude - c.EARTH_RAD_EQ;
    let fields = [0.0, 0.0, 0.0];
    if (rDist <= c.EXP_ATMOSPHERE[0][0]) {
      fields = c.EXP_ATMOSPHERE[0];
    } else if (rDist >= c.EXP_ATMOSPHERE[c.EXP_ATMOSPHERE.length - 1][0]) {
      fields = c.EXP_ATMOSPHERE[c.EXP_ATMOSPHERE.length - 1];
    } else {
      for (let i = 0; i < c.EXP_ATMOSPHERE.length - 1; i++) {
        if (
          c.EXP_ATMOSPHERE[i][0] <= rDist &&
          rDist < c.EXP_ATMOSPHERE[i + 1][0]
        ) {
          fields = c.EXP_ATMOSPHERE[i];
        }
      }
    }
    const base = fields[0];
    const density = fields[1];
    const height = fields[2];
    return density * Math.exp(-(rDist - base) / height);
  }