/** Class representing an arbitrary length vector. */
export class Vector {
    /**
     * Create a new Vector object, containing zero for each state element.
     *
     * @param n vector length, expressed as a positive integer
     */
    public static origin(n: number): Vector {
        const output = [];
        for (let i = 0; i < Math.floor(Math.abs(n)); i++) {
            output.push(0);
        }
        return Vector.fromArray(output);
    }

    /**
     * Create a new Vector object, using the elements of an Array.
     *
     * @param values vector elements
     */
    public static fromArray(values: number[]): Vector {
        return new Vector(...values);
    }

    /** Vector state elements. */
    public readonly state: number[];

    /**
     * Create a new Vector object.
     *
     * Vectors can have an arbitrary number state elements, but cannot be empty.
     * An error will be thrown if no elements are provided.
     *
     * @param elements vector elements
     */
    constructor(...elements: number[]) {
        if (elements.length === 0) {
            throw new Error("Vector elements cannot be empty.");
        }
        this.state = elements;
    }

    /** Return a string representation of this state. */
    public toString(): string {
        const fixArray = this.state.map((x) => parseFloat(x.toFixed(3)));
        return `[ ${fixArray.join(", ")} ]`;
    }

    /**
     * Return a subset of the state elements as a new Vector object.
     *
     * Works in a similar way to JavaScript's Array.slice().
     *
     * @param start integer specifying the selection start
     * @param end integer specifying where to end the selection
     */
    public slice(start: number, end: number): Vector {
        return Vector.fromArray(this.state.slice(start, end));
    }

    /** Return the magnitude of this object. */
    get magnitude(): number {
        const sq = this.state.map((x) => x * x);
        const sum = sq.reduce((a, b) => a + b);
        return Math.sqrt(sum);
    }

    /**
     * Calculate the Euclidean distance between this and another Vector.
     *
     * Throws an error if argument and this dimensions do not match.
     *
     * @param v the other vector
     */
    public distance(v: Vector): number {
        this.isDimensionMatched(v);
        let sqDiff = 0;
        for (let i = 0; i < this.state.length; i++) {
            const diff = this.state[i] - v.state[i];
            sqDiff += diff * diff;
        }
        return Math.sqrt(sqDiff);
    }

    /**
     * Perform element-wise addition of this and another Vector.
     *
     * Returns a new Vector object containing the sum. Throws an error if
     * argument and this dimensions do not match.
     *
     * @param v the other vector
     */
    public add(v: Vector): Vector {
        this.isDimensionMatched(v);
        const output = [];
        for (let i = 0; i < this.state.length; i++) {
            output.push(this.state[i] + v.state[i]);
        }
        return Vector.fromArray(output);
    }

    /**
     * Concatinate the elements of this and another Vector.
     *
     * Returns a new Vector object containing the combined state.
     *
     * @param v the other vector
     */
    public concat(v: Vector): Vector {
        let output: number[] = [];
        output = output.concat(this.state);
        output = output.concat(v.state);
        return Vector.fromArray(output);
    }

    /**
     * Linearly scale the elements of this.
     *
     * Returns a new Vector object containing the scaled state.
     *
     * @param n a scalar value
     */
    public scale(n: number): Vector {
        return Vector.fromArray(this.state.map((x) => x * n));
    }

    public pow(n: number): Vector {
        const pState = this.state.map((x) => Math.pow(x, n));
        return Vector.fromArray(pState);
    }

    /**
     * Return the normalized (unit vector) form of this as a new Vector object.
     */
    get normalized(): Vector {
        const m = this.magnitude;
        return Vector.fromArray(this.state.map((x) => x / m));
    }

    /**
     * Calculate the cross product of this and another Vector.
     *
     * Returns the result as a new Vector object. Throws an error if both Vector
     * dimensions are not equal to `3`.
     *
     * @param v the other vector
     */
    public cross(v: Vector): Vector {
        this.isDimensionMatched(v);
        this.isDimensionEqual(3);
        const [x, y, z] = this.state;
        const [vx, vy, vz] = v.state;
        return new Vector(
            y * vz - z * vy,
            z * vx - x * vz,
            x * vy - y * vx,
        );
    }

    /**
     * Calculate the dot product this and another Vector.
     *
     * Throws an error if argument and this dimensions do not match.
     *
     * @param v the other vector
     */
    public dot(v: Vector): number {
        this.isDimensionMatched(v);
        let output = 0;
        for (let i = 0; i < this.state.length; i++) {
            output += this.state[i] * v.state[i];
        }
        return output;
    }

    /**
     * Rotate the elements of this along the x-axis.
     *
     * Throws an error if this dimension is not equal to `3`.
     *
     * @param theta rotation angle, in radians
     */
    public rot1(theta: number): Vector {
        this.isDimensionEqual(3);
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const [x, y, z] = this.state;
        return new Vector(
            1 * x + 0 * y + 0 * z,
            0 * x + cosT * y + sinT * z,
            0 * x + -sinT * y + cosT * z,
        );
    }

    /**
     * Rotate the elements of this along the y-axis.
     *
     * Throws an error if this dimension is not equal to `3`.
     *
     * @param theta rotation angle, in radians
     */
    public rot2(theta: number): Vector {
        this.isDimensionEqual(3);
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const [x, y, z] = this.state;
        return new Vector(
            cosT * x + 0 * y + -sinT * z,
            0 * x + 1 * y + 0 * z,
            sinT * x + 0 * y + cosT * z,
        );
    }

    /**
     * Rotate the elements of this along the z-axis.
     *
     * Throws an error if this dimension is not equal to `3`.
     *
     * @param theta rotation angle, in radians
     */
    public rot3(theta: number): Vector {
        this.isDimensionEqual(3);
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const [x, y, z] = this.state;
        return new Vector(
            cosT * x + sinT * y + 0 * z,
            -sinT * x + cosT * y + 0 * z,
            0 * x + 0 * y + 1 * z,
        );
    }

    /**
     * Calculate the angle, in radians, between this and another Vector.
     *
     * Throws an error if argument and this dimensions do not match.
     *
     * @param v the other vector
     */
    public angle(v: Vector): number {
        this.isDimensionMatched(v);
        return Math.acos(this.dot(v) / (this.magnitude * v.magnitude));
    }

    /**
     * Change coordinates of this to the relative position from a new origin.
     *
     * Throws an error if argument and this dimensions do not match.
     *
     * @param origin new origin
     */
    public changeOrigin(origin: Vector): Vector {
        this.isDimensionMatched(origin);
        const delta = origin.scale(-1);
        return this.add(delta);
    }

    /** Return the vector state dimension. */
    get dimension(): number {
        return this.state.length;
    }

    /** Throw an error if dimensions do not match argument. */
    private isDimensionMatched(v: Vector): void {
        if (this.dimension !== v.dimension) {
            throw new Error("Argument dimension doesn't match this.");
        }
    }

    /** Throw an error if dimensions do not equal argument. */
    private isDimensionEqual(n: number): void {
        if (this.dimension !== n) {
            throw new Error(`This dimension must equal: ${n}`);
        }
    }
}
