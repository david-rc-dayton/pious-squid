import * as assert from "assert";
import { J2000, Vector3D, EpochUTC, ITRF } from "../pious-squid";

const j2kState = new J2000(
  EpochUTC.fromDateString("2004-04-06T07:51:28.386Z"),
  new Vector3D(5102.5096, 6123.01152, 6378.1363),
  new Vector3D(-4.7432196, 0.7905366, 5.53375619)
);

const itrfState = new ITRF(
  EpochUTC.fromDateString("2004-04-06T07:51:28.386Z"),
  new Vector3D(-1033.479383, 7901.2952758, 6380.3565953),
  new Vector3D(-3.22563652, -2.87245145, 5.531924446)
);

describe("J2000", () => {
  const testState = j2kState.toITRF();
  it("should convert to ITRF within 275m", () => {
    const rDist = itrfState.position.distance(testState.position) * 1000;
    assert(rDist <= 275);
  });
  it("should convert to ITRF within 0.175m/s", () => {
    const vDist = itrfState.velocity.distance(testState.velocity) * 1000;
    assert(vDist <= 0.175);
  });
});

describe("ITRF", () => {
  const testState = itrfState.toJ2000();
  it("should convert to J2000 within 275m", () => {
    const rDist = j2kState.position.distance(testState.position) * 1000;
    assert(rDist <= 275);
  });
  it("should convert to J2000 within 0.175m/s", () => {
    const vDist = j2kState.velocity.distance(testState.velocity) * 1000;
    assert(vDist <= 0.175);
  });
});
