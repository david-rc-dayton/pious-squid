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

export let FINALS: FinalsData[] = [];

export function clearFinals() {
  FINALS = [];
}

export function sortFinals() {
  FINALS.sort((a, b) => a.mjd - b.mjd);
}

export function zeroFinal(fmjd: number): FinalsData {
  return { mjd: fmjd, pmX: 0, pmY: 0, dut1: 0, lod: 0, dPsi: 0, dEps: 0 };
}
