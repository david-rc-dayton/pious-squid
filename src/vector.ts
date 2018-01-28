export class Vector {
    public state: number[]

    constructor(values: number[]) {
        this.state = values
    }

    public static origin(n: number): Vector {
        let output = []
        for (let i = 0; i < n; i++) {
            output.push(0)
        }
        return new Vector(output)
    }

    public toString(): string {
        return this.state.toString()
    }

    public slice(start: number, end: number): Vector {
        return new Vector(this.state.slice(start, end))
    }

    public magnitude(): number {
        let sq = this.state.map((x) => x * x)
        let sum = sq.reduce((a, b) => a + b)
        return Math.sqrt(sum)
    }

    public distance(v: Vector): number {
        let sqDiff = 0
        for (let i = 0; i < this.state.length; i++) {
            let diff = this.state[i] - v.state[i]
            sqDiff += diff * diff
        }
        return Math.sqrt(sqDiff)
    }

    public add(v: Vector): Vector {
        let output = []
        for (let i = 0; i < this.state.length; i++) {
            output.push(this.state[i] + v.state[i])
        }
        return new Vector(output)
    }

    public concat(v: Vector): Vector {
        let output: number[] = [];
        output = output.concat(this.state)
        output = output.concat(v.state)
        return new Vector(output)
    }

    public scale(n: number): Vector {
        return new Vector(this.state.map((x) => x * n))
    }

    public normalize(): Vector {
        let m = this.magnitude()
        return new Vector(this.state.map((x) => x / m))
    }

    public cross(v: Vector): Vector {
        let [x, y, z] = this.state
        let [vx, vy, vz] = v.state
        return new Vector([
            y * vz - z * vy,
            z * vx - x * vz,
            x * vy - y * vx,
        ])
    }

    public dot(v: Vector): number {
        let output = 0
        for (let i = 0; i < this.state.length; i++) {
            output += this.state[i] * v.state[i]
        }
        return output
    }

    public rot1(theta: number) {
        let cosT = Math.cos(theta)
        let sinT = Math.sin(theta)
        let [x, y, z] = this.state
        return new Vector([
            1 * x + 0 * y + 0 * z,
            0 * x + cosT * y + sinT * z,
            0 * x + -sinT * y + cosT * z,
        ])
    }

    public rot2(theta: number) {
        let cosT = Math.cos(theta)
        let sinT = Math.sin(theta)
        let [x, y, z] = this.state
        return new Vector([
            cosT * x + 0 * y + -sinT * z,
            0 * x + 1 * y + 0 * z,
            sinT * x + 0 * y + cosT * z,
        ])
    }

    public rot3(theta: number) {
        let cosT = Math.cos(theta)
        let sinT = Math.sin(theta)
        let [x, y, z] = this.state
        return new Vector([
            cosT * x + sinT * y + 0 * z,
            -sinT * x + cosT * y + 0 * z,
            0 * x + 0 * y + 1 * z,
        ])
    }
}
