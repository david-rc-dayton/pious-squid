import * as assert from "assert";
import { TEME } from "../coordinates/teme";
import { DataHandler } from "../data/data-handler";
import { EpochUTC, ITRF, J2000, Vector3D } from "../index";

DataHandler.setFinalsData([
  " 4 4 5 53100.00 I -0.141198 0.000079  0.331215 0.000051  I-0.4384012 0.0000027  1.5611 0.0020  I   -52.007     .409    -4.039     .198 -0.141110  0.330940 -0.4383520   -52.100    -4.100",
  " 4 4 6 53101.00 I -0.140722 0.000071  0.333536 0.000057  I-0.4399498 0.0000028  1.5244 0.0019  I   -52.215     .380    -3.846     .166 -0.140720  0.333270 -0.4399620   -52.500    -4.000",
  " 4 4 7 53102.00 I -0.140160 0.000067  0.336396 0.000060  I-0.4414071 0.0000026  1.3591 0.0024  I   -52.703     .380    -3.878     .166 -0.140070  0.336140 -0.4414210   -52.700    -4.100"
]);

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

const temeState = new TEME(
  EpochUTC.fromDateString("2017-04-28T12:45:00.000Z"),
  new Vector3D(12850.591182156, -40265.812871482, -282.022494587),
  new Vector3D(5.860360679, 1.871425143, -0.077719199)
);

describe("J2000", () => {
  const testState = j2kState.toITRF();
  it("should convert to ITRF within 0.6m", () => {
    const rDist = itrfState.position.distance(testState.position) * 1000;
    assert(rDist <= 0.6);
  });
  it("should convert to ITRF within 0.0004m/s", () => {
    const vDist = itrfState.velocity.distance(testState.velocity) * 1000;
    assert(vDist <= 0.0004);
  });
});

describe("ITRF", () => {
  const testState = itrfState.toJ2000();
  it("should convert to J2000 within 0.6m", () => {
    const rDist = j2kState.position.distance(testState.position) * 1000;
    assert(rDist <= 0.6);
  });
  it("should convert to J2000 within 0.0004m/s", () => {
    const vDist = j2kState.velocity.distance(testState.velocity) * 1000;
    assert(vDist <= 0.0004);
  });
});

describe("TEME", () => {
  const testState = temeState.toJ2000();
  const expected = new J2000(
    EpochUTC.fromDateString("2017-04-28T12:45:00.000Z"),
    new Vector3D(12694.023495137, -40315.279590286, -304.820736794),
    new Vector3D(5.867428953, 1.848712469, -0.087403192)
  );
  it("should convert to J2000 within 0.3m", () => {
    const rDist = expected.position.distance(testState.position) * 1000;
    assert(rDist <= 0.3);
  });
  it("should convert to J2000 within 0.00005m/s", () => {
    const vDist = expected.velocity.distance(testState.velocity) * 1000;
    assert(vDist <= 0.00005);
  });
  const convBack = temeState.toJ2000().toTEME();
  it("should convert back to J2000 within 1e-8m.", () => {
    const rDist = temeState.position.distance(convBack.position) * 1000;
    assert(rDist <= 1e-8);
  });
  it("should convert back to J2000 within 1e-11m/s.", () => {
    const vDist = temeState.velocity.distance(convBack.velocity) * 1000;
    assert(vDist <= 1e-11);
  });
});
