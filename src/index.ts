// bodies
import { MoonBody } from "./bodies/moon-body";
import { SunBody } from "./bodies/sun-body";
export const bodies = {
  MoonBody: MoonBody,
  SunBody: SunBody
};

// constructs
// (nothing yet...)

// coordinates
import { ClassicalElements } from "./coordinates/classical-elements";
import { Geodetic } from "./coordinates/geodetic";
import { ITRF } from "./coordinates/itrf";
import { J2000 } from "./coordinates/j2000";
export const coordinates = {
  ClassicalElements: ClassicalElements,
  Geodetic: Geodetic,
  ITRF: ITRF,
  J2000: J2000
};

// data
import { DataHandler } from "./data/data-handler";
export const data = {
  DataHandler: DataHandler
};

// math
import { Vector3D } from "./math/vector-3d";
export const math = {
  Vector3D: Vector3D
};

// propagators
import { Kepler } from "./propagators/kepler";
import { RungeKutta4 } from "./propagators/runge-kutta-4";
export const propagators = {
  Kepler: Kepler,
  RungeKutta4: RungeKutta4
};

// time
import { EpochUTC } from "./time/epoch-utc";
export const time = {
  EpochUTC: EpochUTC
};
