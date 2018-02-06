/** Options for the Kepler propagation model. */
export interface IKeplerModel {
    /** First derivative mean motion, in revolutions/day^2. */
    nDot?: number;
    /** Second derivative of mean motion, in revolutions/day^3 */
    nDDot?: number;
    /** Model effects of atmospheric drag, if true. */
    atmosphericDrag?: boolean;
    /** Model J2 effect, if true. */
    j2Effect?: boolean;
}

/** Options for numerical integration propagation models. */
export interface INumericalModel {
    stepSize?: number;
    j2Effect?: boolean;
    j3Effect?: boolean;
    j4Effect?: boolean;
    gravitySun?: boolean;
    gravityMoon?: boolean;
    solarRadiation?: boolean;
    atmosphericDrag?: boolean;
    mass?: number;
    area?: number;
    drag?: number;
    reflect?: number;
}
