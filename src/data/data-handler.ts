import { LEAP_SECONDS } from "./values/leap-seconds";

export interface FinalsData {
  mjd: number;
  pmX: number;
  pmY: number;
  dut1: number;
}

/** Fetch the number of leap seconds used in offset. */
export function leapSecondsOffset(jd: number) {
  if (jd > LEAP_SECONDS[LEAP_SECONDS.length - 1][0]) {
    return LEAP_SECONDS[LEAP_SECONDS.length - 1][1];
  }
  if (jd < LEAP_SECONDS[0][0]) {
    return 0;
  }
  for (let i = 0; i < LEAP_SECONDS.length - 2; i++) {
    if (LEAP_SECONDS[i][0] <= jd && jd < LEAP_SECONDS[i + 1][0]) {
      return LEAP_SECONDS[i][1];
    }
  }
  return 0;
}

export function getFinalsData(mjd: number): FinalsData {
  const fmjd = Math.floor(mjd);
  return { mjd: fmjd, pmX: 0, pmY: 0, dut1: 0 };
}
