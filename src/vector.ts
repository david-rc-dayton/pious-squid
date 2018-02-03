/** Class representing an arbitrary length vector. */
export class Vector {
    /**
     * Create a new Vector object, using the elements of an Array.
     *
     * @param values vector elements
     */
    public static fromArray(values: number[]): Vector {
        const output = new Vector();
        output.state = values;
        return output;
    }

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

    /** Vector state elements. */
    public state: number[];

    /**
     * Create a new Vector object.
     *
     * @param values vector elements
     */
    constructor(...values: number[]) {
        this.state = values;
    }

    /** Return the string representation of the state array. */
    public toString(): string {
        return this.state.toString();
    }

    /**
     * Return a subset of the state elements as a new Vector object. Works in
     * a similar way to JavaScript's Array.slice().
     *
     * @param start integer specifying the selection start
     * @param end integer specifying where to end the selection
     */
    public slice(start: number, end: number): Vector {
        return Vector.fromArray(this.state.slice(start, end));
    }

    /** Calculate the magnitude of the Vector object. */
    public magnitude(): number {
        const sq = this.state.map((x) => x * x);
        const sum = sq.reduce((a, b) => a + b);
        return Math.sqrt(sum);
    }

    /**
     * Calculate the Euclidean distance between two Vector objects.
     *
     * @param v the other vector
     */
    public distance(v: Vector): number {
        let sqDiff = 0;
        for (let i = 0; i < this.state.length; i++) {
            const diff = this.state[i] - v.state[i];
            sqDiff += diff * diff;
        }
        return Math.sqrt(sqDiff);
    }

    /**
     * Perform element-wise addition of two Vector objects and return a new
     * Vector object containing the sum.
     *
     * @param v the other vector
     */
    public add(v: Vector): Vector {
        const output = [];
        for (let i = 0; i < this.state.length; i++) {
            output.push(this.state[i] + v.state[i]);
        }
        return Vector.fromArray(output);
    }

    /**
     * Concatinate the elements of two Vector objects and return a new Vector
     * object containing the combined state.
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
     * Linearly scale the elements of a Vector object and return a new Vector
     * object containing the scaled values.
     *
     * @param n a scalar value
     */
    public scale(n: number): Vector {
        return Vector.fromArray(this.state.map((x) => x * n));
    }

    /**
     * Return the normalized (unit vector) form of the Vector object as a new
     * Vector object.
     */
    public normalize(): Vector {
        const m = this.magnitude();
        return Vector.fromArray(this.state.map((x) => x / m));
    }

    /**
     * Calculate the cross product of two vectors and return the result as a
     * new Vector object.
     *
     * @param v the other vector
     */
    public cross(v: Vector): Vector {
        const [x, y, z] = this.state;
        const [vx, vy, vz] = v.state;
        return new Vector(
            y * vz - z * vy,
            z * vx - x * vz,
            x * vy - y * vx,
        );
    }

    /**
     * Calculate the dot product of two vectors and return the result as a new
     * Vector object.
     *
     * @param v the other vector
     */
    public dot(v: Vector): number {
        let output = 0;
        for (let i = 0; i < this.state.length; i++) {
            output += this.state[i] * v.state[i];
        }
        return output;
    }

    /**
     * Rotate the Vector state elements along the x-axis.
     *
     * @param theta rotation angle, in radians
     */
    public rot1(theta: number): Vector {
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
     * Rotate the Vector state elements along the y-axis.
     *
     * @param theta rotation angle, in radians
     */
    public rot2(theta: number): Vector {
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
     * Rotate the Vector state elements along the z-axis.
     *
     * @param theta rotation angle, in radians
     */
    public rot3(theta: number): Vector {
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const [x, y, z] = this.state;
        return new Vector(
            cosT * x + sinT * y + 0 * z,
            -sinT * x + cosT * y + 0 * z,
            0 * x + 0 * y + 1 * z,
        );
    }
}
