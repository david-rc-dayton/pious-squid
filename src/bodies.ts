import {
    ASTRONOMICAL_UNIT, DEG2RAD, EARTH_RAD_EQ, EXP_ATMOSPHERE, IAU_1980, MM2R,
} from "./constants";
import { Epoch } from "./epoch";
import { evalPoly } from "./operations";
import { Vector } from "./vector";

export function precession(epoch: Epoch): [number, number, number] {
    const t = epoch.toTerrestrialCenturies();
    const zeta = evalPoly(t, [0.0, 0.6406161, 0.0000839, 5.0e-6]) * DEG2RAD;
    const theta = evalPoly(t, [0.0, 0.5567530, -0.0001185, -1.16e-5]) * DEG2RAD;
    const zed = evalPoly(t, [0.0, 0.6406161, 0.0003041, 5.1e-6]) * DEG2RAD;
    return [zeta, theta, zed];
}

export function nutation(epoch: Epoch): [number, number, number] {
    const degRev = 360;
    const t = epoch.toTerrestrialCenturies();
    const moonAnom = (evalPoly(t,
        [134.96340251, 1325.0 * degRev + 198.8675605, 0.0088553, 1.4343e-5])
        % degRev * DEG2RAD);
    const sunAnom = (evalPoly(
        t, [357.52910918, 99.0 * degRev + 359.0502911, -0.0001537, 3.8e-8])
        % degRev * DEG2RAD);
    const moonLat = (evalPoly(t,
        [93.27209062, 1342.0 * degRev + 82.0174577, -0.0035420, -2.88e-7])
        % degRev * DEG2RAD);
    const sunElong = (evalPoly(t,
        [297.85019547, 1236.0 * degRev + 307.1114469, -0.0017696, 1.831e-6])
        % degRev * DEG2RAD);
    const moonRaan = (evalPoly(t,
        [125.04455501, -(5.0 * degRev + 134.1361851), 0.0020756, 2.139e-6])
        % degRev * DEG2RAD);
    let deltaPsi = 0;
    let deltaEpsilon = 0;
    IAU_1980.map((iauLine) => {
        const arg = (
            iauLine[0] * moonAnom +
            iauLine[1] * sunAnom +
            iauLine[2] * moonLat +
            iauLine[3] * sunElong +
            iauLine[4] * moonRaan);
        const sinC = iauLine[5] + iauLine[6] * t;
        const cosC = iauLine[7] + iauLine[8] * t;
        deltaPsi = deltaPsi + sinC * Math.sin(arg);
        deltaEpsilon = deltaEpsilon + cosC * Math.cos(arg);
    });
    deltaPsi = deltaPsi * MM2R;
    deltaEpsilon = deltaEpsilon * MM2R;
    const meanEpsilon = evalPoly(t,
        [23.439291, -0.013004, -1.64e-7, 5.04e-7],
    ) % degRev * DEG2RAD;
    return [deltaPsi, deltaEpsilon, meanEpsilon];
}

export function atmosphericDensity(position: Vector): number {
    const rDist = position.magnitude() - EARTH_RAD_EQ;
    let fields = [0.0, 0.0, 0.0];
    if (rDist <= EXP_ATMOSPHERE[0][0]) {
        fields = EXP_ATMOSPHERE[0];
    } else if (rDist >= EXP_ATMOSPHERE[EXP_ATMOSPHERE.length - 1][0]) {
        fields = EXP_ATMOSPHERE[EXP_ATMOSPHERE.length - 1];
    } else {
        for (let i = 0; i < EXP_ATMOSPHERE.length - 1; i++) {
            if (EXP_ATMOSPHERE[i][0] <= rDist
                && rDist < EXP_ATMOSPHERE[i + 1][0]) {
                fields = EXP_ATMOSPHERE[i];
            }
        }
    }
    const base = fields[0];
    const density = fields[1];
    const height = fields[2];
    return density * Math.exp(-(rDist - base) / height);
}

export function moonPosition(epoch: Epoch): Vector {
    const [sin, cos] = [Math.sin, Math.cos];
    const jCent = epoch.toJulianCenturies();
    const lamEcl = ((218.32 +
        481267.883 * jCent +
        6.29 * sin((134.9 + 477198.85 * jCent) * DEG2RAD) -
        1.27 * sin((259.2 - 413335.38 * jCent) * DEG2RAD) +
        0.66 * sin((235.7 + 890534.23 * jCent) * DEG2RAD) +
        0.21 * sin((269.9 + 954397.70 * jCent) * DEG2RAD) -
        0.19 * sin((357.5 + 35999.05 * jCent) * DEG2RAD) -
        0.11 * sin((186.6 + 966404.05 * jCent) * DEG2RAD))
        % 360) * DEG2RAD;
    const phiEcl = ((5.13 * sin((93.3 + 483202.03 * jCent) * DEG2RAD) +
        0.28 * sin((228.2 + 960400.87 * jCent) * DEG2RAD) -
        0.28 * sin((318.3 + 6003.18 * jCent) * DEG2RAD) -
        0.17 * sin((217.6 - 407332.20 * jCent) * DEG2RAD))
        % 360) * DEG2RAD;
    const pllx = ((0.9508 +
        0.0518 * cos((134.9 + 477198.85 * jCent) * DEG2RAD) +
        0.0095 * cos((259.2 - 413335.38 * jCent) * DEG2RAD) +
        0.0078 * cos((235.7 + 890534.23 * jCent) * DEG2RAD) +
        0.0028 * cos((269.9 + 954397.70 * jCent) * DEG2RAD))
        % 360) * DEG2RAD;
    const obq = ((23.439291 - 0.0130042 * jCent) % 360) * DEG2RAD;
    const rMag = 1.0 / sin(pllx);
    const rI = rMag * (cos(phiEcl) * cos(lamEcl)) * EARTH_RAD_EQ;
    const rJ = (rMag * (cos(obq) * cos(phiEcl) * sin(lamEcl)
        - (sin(obq) * sin(phiEcl)))) * EARTH_RAD_EQ;
    const rK = (rMag * (sin(obq) * cos(phiEcl) * sin(lamEcl)
        + (cos(obq) * sin(phiEcl)))) * EARTH_RAD_EQ;
    return new Vector([rI, rJ, rK]);
}

export function sunPosition(epoch: Epoch): Vector {
    const [sin, cos] = [Math.sin, Math.cos];
    const jCent = epoch.toJulianCenturies();
    const lamSun = (280.460 + 36000.770 * jCent) % 360;
    const mSun = ((357.5277233 + 35999.05034 * jCent) % 360) * DEG2RAD;
    const lamEc = ((lamSun + 1.914666471 * sin(mSun)
        + 0.019994643 * sin(2 * mSun)) % 360) * DEG2RAD;
    const obliq = (23.439291 - 0.0130042 * jCent) * DEG2RAD;
    const rMag =
        (1.000140612 - 0.016708617 * cos(mSun) - 0.000139589 * cos(2 * mSun));
    return new Vector([
        rMag * cos(lamEc) * ASTRONOMICAL_UNIT,
        rMag * cos(obliq) * sin(lamEc) * ASTRONOMICAL_UNIT,
        rMag * sin(obliq) * sin(lamEc) * ASTRONOMICAL_UNIT,
    ]);
}
