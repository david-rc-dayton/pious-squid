export interface FinalsData {
  /** USNO modified julaian date */
  mjd: number;
  /** polar motion x-component (degrees) */
  pmX: number;
  /** polar motion y-component (degrees) */
  pmY: number;
  /** delta ut1 time (seconds) */
  dut1: number;
  /** length of day (seconds) */
  lod: number;
  /** delta psi (degrees) */
  dPsi: number;
  /** delta epsilon (degrees) */
  dEps: number;
}

/** IERS finals.all data. */
export let FINALS: FinalsData[] = [];

/** Clear cached finals.all data. */
export function clearFinals() {
  FINALS = [];
}

/** Sort finals.all data by modified julian date. */
export function sortFinals() {
  FINALS.sort((a, b) => a.mjd - b.mjd);
}

/** Return a finals entry with all values set to zero. */
export function zeroFinal(fmjd: number): FinalsData {
  return { mjd: fmjd, pmX: 0, pmY: 0, dut1: 0, lod: 0, dPsi: 0, dEps: 0 };
}
